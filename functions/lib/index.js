"use strict";
const { onCall, HttpsError, onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { sendMail, emailOptions } = require("./gmail/main");
const { createEventFromJSON, manageAttendees, eventTemplate, deleteCalendarEvent } = require("./calendar/main");
const { getSheetAsJSON } = require("./drive/main");
admin.initializeApp();
const db = getFirestore("maindb");
const send = async (options) => {
    let messageId = await sendMail(options);
    return messageId;
};
exports.sendEmail = onCall({
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, (request) => {
    let messageOptions = emailOptions;
    messageOptions.to = request.data.email;
    messageOptions.subject = request.data.subject;
    messageOptions.text = request.data.text;
    return send(messageOptions);
});
exports.bugReport = onCall({
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, (request) => {
    let messageOptions = emailOptions;
    messageOptions.to = "bailey.tuckman@westtown.edu";
    messageOptions.subject = `Polaris bug report: ${request.data.page}`;
    messageOptions.text = `On ${new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    })} there was a bug reported on  ${request.data.page} by ${request.data.email ? request.data.email : "anonymous"}.\n\nDescription:\n${request.data.description}\n\nSteps to Reproduce: ${request.data.repro}`;
    return send(messageOptions);
});
exports.handleSignup = onCall({
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, async (request) => {
    if (request.auth === null)
        return { status: "failed", information: "User not signed in." };
    let currentWeekendDoc = await db.collection("activeWeekend").doc("default").get();
    let currentWeekend = JSON.parse(currentWeekendDoc.data().information);
    let attendeeRemoved = false;
    const id = request.data.id;
    const displayName = request.auth.token.name;
    const email = request.auth.token.email;
    let event = currentWeekend.days[Number(id[0])][Number(id.slice(2))];
    let currentDate = new Date();
    let eventDate = new Date(currentWeekend.startDate + "T00:00:00");
    eventDate.setTime(eventDate.getTime() + 1000 * 60 * 60 * 24 * Number(id[0]));
    eventDate.setTime(eventDate.getTime() +
        (1000 * 60 * 60 * Number(event.timeStart.slice(0, 2)) + 1000 * 60 * Number(event.timeStart.slice(3))));
    if (event.admission.val === "none")
        return { status: "fail", information: "Event has no signup" };
    if (eventDate < currentDate) {
        return { status: "failed", information: "Cannot sign up for past event." };
    }
    for (let signupNum in event.signups) {
        if (event.signups[signupNum].email === email) {
            currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.splice(signupNum, 1);
            attendeeRemoved = true;
            if (eventDate.getTime() - currentDate.getTime() < 1000 * 60 * 60 * 2) {
                let studentDoc = db.collection("users").doc(email).get().data();
                studentDoc.credit -= 5;
                db.collection("users").doc(email).set(studentDoc);
            }
        }
    }
    if (!attendeeRemoved) {
        let admitStatus = "pending";
        let studentDoc;
        let student;
        let credit;
        switch (event.admission.val) {
            case "randLottery":
                if (event.admission.filtered && event.signups.length < event.numSpots) {
                    admitStatus = "approved";
                }
                currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
                    displayName: displayName,
                    email: email,
                    status: admitStatus,
                });
                break;
            case "creditLottery":
                if (event.admission.filtered && event.signups.length < event.numSpots) {
                    admitStatus = "approved";
                }
                studentDoc = await db.collection("users").doc(request.auth.token.email).get();
                student = studentDoc.data();
                credit = student.credit;
                currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
                    displayName: displayName,
                    email: email,
                    status: admitStatus,
                    credit: credit,
                });
                break;
            case "credit":
                studentDoc = await db.collection("users").doc(request.auth.token.email).get();
                student = studentDoc.data();
                credit = student.credit;
                currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
                    displayName: displayName,
                    email: email,
                    status: admitStatus,
                    credit: credit,
                });
                currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.sort((a, b) => b.credit - a.credit);
                break;
            default:
                if (event.signups.length < event.numSpots) {
                    admitStatus = "approved";
                }
                currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups.push({
                    displayName: displayName,
                    email: email,
                    status: admitStatus,
                });
                break;
        }
    }
    if (event.admission.filtered ||
        event.admission.val === "signup" ||
        event.admission.val === "advLottery" ||
        event.admission.val === "credit") {
        for (let i = 0; i < event.signups.length; i++) {
            currentWeekend.days[Number(id[0])][Number(id.slice(2))].signups[i].status =
                i < event.numSpots ? "approved" : "pending";
        }
    }
    try {
        let setRes = await db
            .collection("activeWeekend")
            .doc("default")
            .set({
            information: JSON.stringify(currentWeekend),
        });
        let attendeesRes = await manageAttendees(currentWeekend.days[Number(id[0])][Number(id.slice(2))]);
        return { status: "success", information: JSON.stringify({ db: setRes, GCal: attendeesRes }) };
    }
    catch (error) {
        return { status: "error", information: error.message };
    }
});
const saveEvents = async (request) => {
    let activeWeekend = await db.collection("activeWeekend").doc("default").get();
    activeWeekend = JSON.parse(activeWeekend.data().information);
    for (let i = 0; i < activeWeekend.days.length; i++) {
        for (let eventNum = 0; eventNum < activeWeekend.days[i].length; eventNum++) {
            let event = activeWeekend.days[i][eventNum];
            if (event.calID)
                continue;
            let template = eventTemplate;
            template.summary = event.title;
            template.description = event.description;
            template.location = event.location;
            for (let signup of event.signups) {
                if (signup.status === "approved" || signup.status === "checkedIn") {
                    template.attendees.push({ email: signup.email });
                }
            }
            let startDate = new Date(activeWeekend.startDate + `T${event.timeStart}:00`);
            startDate.setTime(startDate.getTime() + 1000 * 60 * 60 * 24 * i);
            template.start.dateTime = startDate.toISOString().substring(0, 23);
            let endDate = new Date(activeWeekend.startDate + `T${event.timeEnd}:00`);
            endDate.setTime(endDate.getTime() + 1000 * 60 * 60 * 24 * i);
            template.end.dateTime = endDate.toISOString().substring(0, 23);
            let result = await createEventFromJSON(template);
            activeWeekend.days[i][eventNum].calID = result.data.id;
        }
    }
    let setRes = await db
        .collection("activeWeekend")
        .doc("default")
        .set({
        information: JSON.stringify(activeWeekend),
    });
    return JSON.stringify(setRes);
};
exports.saveWeekendEvents = onCall({
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, (request) => {
    try {
        let res = saveEvents(request);
        return { status: "sucess", information: res };
    }
    catch (error) {
        return { status: "error", information: error.message };
    }
});
exports.deleteEvent = onCall({
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, async (request) => {
    if (request.data.eventID)
        return await deleteCalendarEvent(request.data.eventID);
    try {
        for (let id of request.data.eventIDs) {
            await deleteCalendarEvent(id);
        }
    }
    catch (error) {
        return { status: "error", information: error.message };
    }
});
exports.createNewUser = onCall({
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, async (request) => {
    const userDoc = {
        isAdmin: false,
        email: "",
        events: [],
        credit: 0,
        displayName: "",
    };
    let userInfo = userDoc;
    userInfo.email = request.auth.token.email;
    userInfo.displayName = request.data.displayName;
    let adminRef = await db.collection("admin").doc(request.auth.token.email).get();
    userInfo.isAdmin = adminRef.exists;
    await db.collection("users").doc(request.auth.token.email).set(userInfo);
    return userInfo;
});
exports.updateWeekend = onSchedule("*/10 6-22 * 1-6,9-12 *", async (request) => {
    let queuedRef = await db.collection("activeWeekend").doc("queued").get();
    if (queuedRef.exists) {
        let data = queuedRef.data().information;
        data = JSON.parse(data);
        let releaseDate = new Date(data.release.dateTime);
        let current = new Date();
        if (releaseDate.getTime() - current.getTime() < 1000 * 60 * 10) {
            data.release.released = true;
            await db
                .collection("activeWeekend")
                .doc("default")
                .set({ information: JSON.stringify(data) });
            await db.collection("activeWeekend").doc("queued").delete();
            await saveEvents({});
        }
    }
    let weekendRef = await db.collection("activeWeekend").doc("default").get();
    let changed = false;
    if (!weekendRef.exists)
        return { status: "sucess", information: "No weekend currently exists" };
    let activeWeekend = JSON.parse(weekendRef.data().information);
    // let weekendEndDate = new Date(activeWeekend.endDate + "T23:59:59");
    let currentDate = new Date();
    // if (weekendEndDate.getTime() - currentDate.getTime() < 0)
    // 	return { status: "sucess", information: "No future weekend" };
    for (let dayNum = 0; dayNum < activeWeekend.days.length; dayNum++) {
        for (let eventNum = 0; eventNum < activeWeekend.days[dayNum].length; eventNum++) {
            let event = activeWeekend.days[dayNum][eventNum];
            if ((event.admission.val === "creditLottery" || event.admission.val === "randLottery") &&
                !event.admission.filtered //&& !activeWeekend.admission.filtered
            ) {
                console.log("trying update");
                let startDate;
                if (activeWeekend.admission && activeWeekend.admission.lotteryTime) {
                    startDate = new Date(activeWeekend.admission.lotteryTime);
                }
                else {
                    startDate = new Date(activeWeekend.startDate + "T00:00:00");
                    startDate.setTime(startDate.getTime() + 1000 * 60 * 60 * 12); /* 12pm on the first day*/
                }
                let diff = startDate.getTime() - currentDate.getTime();
                if (!event.admission.filtered && diff < 1000 * 60 * 15) {
                    changed = true;
                    let array = activeWeekend.days[dayNum][eventNum].signups;
                    activeWeekend.days[dayNum][eventNum].admission.filtered = true;
                    if (event.admission.val == "creditLottery") {
                        for (let attendee of array) {
                            attendee.creditVal = (1 + Math.floor(attendee.credit / 10)) * Math.random();
                        }
                        array.sort((a, b) => b.creditVal - a.creditVal);
                    }
                    else {
                        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
                        for (let i = array.length - 1; i >= 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [array[i], array[j]] = [array[j], array[i]];
                        }
                    }
                    for (let i = 0; i < array.length; i++) {
                        if (i < event.numSpots) {
                            array[i].status = array[i].status === "checkedIn" ? "checkedIn" : "approved";
                        }
                        else
                            break;
                    }
                    await manageAttendees(activeWeekend.days[dayNum][eventNum]);
                    activeWeekend.admission.filtered = true;
                }
            }
            if (!event.admission.credited) {
                let endDate = new Date(activeWeekend.startDate + "T00:00:00");
                endDate.setTime(endDate.getTime() + 1000 * 60 * 60 * 24 * dayNum); /* add day offset*/
                endDate.setTime(endDate.getTime() +
                    (1000 * 60 * 60 * Number(event.timeEnd.slice(0, 2)) +
                        1000 * 60 * Number(event.timeEnd.slice(3))));
                let diff = endDate.getTime() - currentDate.getTime();
                if (diff < 1000 * 60 * 10) {
                    activeWeekend.days[dayNum][eventNum].admission.credited = true;
                    changed = true;
                    for (let i = 0; i < event.signups.length; i++) {
                        let student = event.signups[i];
                        if (student.status === "checkedIn") {
                            let docRef = db.collection("users").doc(student.email);
                            let data = await docRef.get();
                            data = data.data();
                            if (!data.exists)
                                continue;
                            data.credit += 10;
                            await docRef.set(data);
                        }
                        else if (student.status === "noShow" && i <= event.signupNum) {
                            let docRef = db.collection("users").doc(student.email);
                            let data = await docRef.get();
                            if (!data.exists)
                                continue;
                            data = data.data();
                            data.credit -= 5;
                            await docRef.set(data);
                        }
                    }
                }
            }
        }
    }
    if (changed) {
        let setRef = await db
            .collection("activeWeekend")
            .doc("default")
            .set({ information: JSON.stringify(activeWeekend) });
        return { status: "success", information: setRef };
    }
    return { status: "success", information: "no changes made" };
});
const updateUserInfoFunc = async () => {
    let configDoc = await db.collection("settings").doc("config").get();
    if (!configDoc.exists)
        return;
    configDoc = configDoc.data();
    console.log(configDoc);
    if (!configDoc.dataSheet)
        return;
    let sheet = await getSheetAsJSON(configDoc.dataSheet.ID);
    console.log(sheet);
    if (sheet.status === "error")
        return;
    if (!(sheet.data[0].email && sheet.data[0].cell && sheet.data[0].grade))
        return;
    let infoJSON = {};
    for (let row of sheet.data) {
        infoJSON[row.email] = row;
    }
    let batch = db.batch();
    let usersSnap = await db.collection("users").get();
    usersSnap.forEach((element) => {
        if (infoJSON[element.id]) {
            let updateData = { cell: infoJSON[element.id].cell, grade: infoJSON[element.id].grade };
            batch.update(db.collection("users").doc(element.id), updateData);
        }
    });
    await batch.commit();
};
exports.updateUserInfoPeriodic = onSchedule("0 12 * 1-6,9-12 fri", async (request) => {
    // https://crontab.guru/#0_12_*_1-6,9-12_fri
    await updateUserInfoFunc();
});
exports.updateUserInfo = onCall({
    enforceAppCheck: true, // Reject requests with missing or invalid App Check tokens.
}, async (request) => {
    await updateUserInfoFunc();
});
//# sourceMappingURL=index.js.map