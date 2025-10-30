const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/device_snapshot.log');

exports.handleUpload = (req, res) => {
   try {     
    const body = req.body;
        // Log ra console cho dễ kiểm tra
        console.log("📸 Received snapshot:", {
            cmd: body.cmd,
            sequence_no: body.sequence_no,
            cap_time: body.cap_time,
            device_no: body.device_no,
            person_name: body.match?.person_name,
        });
        // 2️⃣ Ghi log chi tiết vào file
        // const logData = `[${new Date().toISOString()}] UPLOAD: ${JSON.stringify(body)}\n`;
        // fs.appendFileSync(logFile, logData);

        // // 3️⃣ Nếu có ảnh base64 thì lưu lại (panoramic hoặc close-up)
        // const imageDir = path.join(__dirname, '../logs/');
        // if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

        // if (body.overall_pic_flag && body.overall_pic?.data) {
        //     const buffer = Buffer.from(body.overall_pic.data, 'base64');
        //     const filename = `overall_${Date.now()}.jpg`;
        //     fs.writeFileSync(path.join(imageDir, filename), buffer);
        // }

        // if (body.closeup_pic_flag && body.closeup_pic?.data) {
        //     const buffer = Buffer.from(body.closeup_pic.data, 'base64');
        //     const filename = `closeup_${Date.now()}.jpg`;
        //     fs.writeFileSync(path.join(imageDir, filename), buffer);
        // }

        // 4️⃣ Chuẩn bị phản hồi "ACK" theo tài liệu
        const ackResponse = {
            reply: "ACK",
            cmd: body.cmd || "face",
            code: 0,
            sequence_no: body.sequence_no,
            cap_time: body.cap_time,
            gateway_ctrl: {
                device_type: "gpio",
                device_no: 1,
                ctrl_mode: "force",
                person_id: body.match?.person_id || "unknown"
            },
            tts: {
                text: `Welcome ${body.match?.person_name || "Guest"}`
            },
            text_display: {
                position: { x: 0, y: 500 },
                alive_time: 1500,
                font_size: 60,
                font_spacing: 1,
                font_color: "0xffffffff",
                text: `Hello ${body.match?.person_name || ""}`
            }
        };

        res.json(ackResponse);
    } catch (err) {
        console.error("❌ Error handling snapshot:", err);
        res.status(500).json({ code: -1, msg: err.message });
    }
};
