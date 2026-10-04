require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/lrb-ping", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    await respond({ text: `Pong \nLatency: \`${latency}ms\`` });
});

app.command("/lrb-help", async ({ command, ack, respond }) => {
    await respond({
        text: `Commands for LRB: \n
        /lrb-dice [d4 | d6 | d8 | d10 | d12 | d20 | d100] - Rolls a dice with the number of selected faces\n
        /lrb-range [min] [max] - picks a random number from a range\n
        /lrb-coin - flips a coin\n\n
        Other commands:\n
        /lrb-help - shows this page\n
        /lrb-ping - check bot latency` });
});

app.command("/lrb-dice", async ({ command, ack, respond }) => {
    await ack();

    const input = command.text.trim().toLowerCase();
    const dice = {
        "": 6,
        "d4": 4,
        "d6": 6,
        "d8": 8,
        "d10": 10,
        "d12": 12,
        "d20": 20,
        "d100": 100
    }

    if (input in dice) {
        const sides = dice[input];
        const roll = Math.floor(Math.random() * sides) + 1;
        return await respond({ text: `You rolled *${roll}*` });
    }

    await respond({ text: `Invalid input: \`${input}\`` });
});

app.command("/lrb-range", async ({ command, ack, respond }) => {
    await ack();

    const input = command.text.trim().split(/\s+/);
    const min = parseInt(input[0], 10);
    const max = parseInt(input[1], 10);

    if (isNaN(min) || isNaN(max) || min >= max) {
        return await respond({ text: `Invalid input: \`${input}\`` });
    }

    const result = Math.floor(Math.random() * (max - min + 1) + min);
    await respond({ text: `Number *${result}* got selected` });
});

app.command("/lrb-coin", async ({ command, ack, respond }) => {
    await ack();

    if (Math.random() > 50) {
        result = "Tails"
    } else {
        result = "Heads"
    }

    await respond({ text: `*${result}*` });
});

app.command("/lrb-8ball", async ({ command, ack, respond }) => {
    await ack();

    const input = command.text.trim();
    if (!input) {
        return await respond({ text: `Invalid input: \`no input\`` });
    }

    const answers = [
        "Yes, but not in the way you're hoping.",
        "No, and you already knew that.",
        "The stars say maybe. The stars are also dumb.",
        "Don't even try asking me again.",
        "It is certain. Kidding. It is not certain.",
        "Go for it, atleast if you fail I can learn from your mistake.",
        "I refuse to be held accountable.",
        "Im a slack bot, what do you expect from me?"
    ]

    const result = answers[Math.floor(Math.random() * answers.length)];

    await respond({ text: `The answer is: *${result}*` });
});

(async () => {
    await app.start();
    console.log("Running");
})();