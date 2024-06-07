import { NextRequest, NextResponse } from "next/server";
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    const body = await request.json()

    const email = body.email || "";
    if (!isValidEmail(email)) {
        return NextResponse.json({ message: "Invalid email" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
        },
        auth: {
            user: process.env.REWARD_MAIL,
            pass: process.env.REWARD_PASSWORD
        }
    });

    const code = generateRandomCode()
    const mailOptions = {
        from: process.env.REWARD_MAIL,
        to: email,
        subject: 'You have been sent a code from Strase!',
        text: `Strase Redeem Code: ${code}`,
        html: `
        <h1>Congratz</h1>
        <div>Here's the reward for </div>
        <div>Code: ${generateRandomCode()}</div>
        `.trim()
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error mailing reward" }, { status: 400 });
    }

    return NextResponse.json({ status: true, })
}

const isValidEmail = (email: string): boolean => {
    const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    return emailRegex.test(email);
};

const generateRandomCode = (): string => {
    const chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const segments: number = 4;
    const segmentLength: number = 4;
    const totalLength: number = segments * segmentLength;
    let result: string[] = new Array(totalLength);

    for (let i = 0; i < totalLength; i++) {
        const randomIndex: number = Math.floor(Math.random() * chars.length);
        result[i] = chars[randomIndex];
    }

    // Join the array into a string and insert spaces at the required positions
    return result.join('').replace(/(.{4})/g, '$1 ').trim();
}