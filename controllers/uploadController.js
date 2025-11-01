const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/device_snapshot.log');

exports.handleUpload = (req, res) => {
   try {     
    const body = req.body;
        // Log ra console cho dễ kiểm tra
        // console.log("📸 Received snapshot:", {
        //     cmd: body.cmd,
        //     sequence_no: body.sequence_no,
        //     cap_time: body.cap_time,
        //     device_no: body.device_no,
        //     person_name: body.match?.person_name,
        // });
        console.log("========================================");
        console.log("📸 [Snapshot Received at]", new Date().toISOString());
        console.log(JSON.stringify(body, null, 2));
        console.log("========================================\n");
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
            cmd: "face",
            code: 0,
            sequence_no: body?.sequence_no,
            cap_time: body?.cap_time
            // tts: {
            //     text: body?.match?.person_name || ""
            // },
            // gateway_ctrl: {
            //     device_type: "gpio",
            //     device_no: 1,
            //     ctrl_mode: "force",
            // },
            
            // text_displays: [
            //     {
            //         position: { 
            //             x: 0, 
            //             y: 450 
            //         },
            //         alive_time: 5000,
            //         font_size: 120,
            //         font_spacing: 1,
            //         font_color: "0xff00ff00",
            //         text: body?.match?.person_name || ""
            //     },
            //     {
            //         position: { 
            //             x: 0, 
            //             y: 300 
            //         },
            //         alive_time: 5000,
            //         font_size: 50,
            //         font_spacing: 1,
            //         font_color: "0xffff0000",
            //         text: body?.match?.person_name || ""
            //     }
            // ]
        };

        return res.status(200).json(ackResponse);
    } catch (err) {
        console.error("❌ Error handling snapshot:", err);
        return res.status(500).json({ code: -1, msg: err.message });
    }
};
