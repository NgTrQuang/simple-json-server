const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/heart.log');

// Giả lập danh sách lệnh đang chờ gửi cho thiết bị
let pendingCommand = null;

exports.handleHeartbeat = (req, res) => {
  const body = req.body;
  const logData = `[${new Date().toISOString()}] HEARTBEAT: ${JSON.stringify(body)}\n`;
  fs.appendFileSync(logFile, logData);

  // Nếu thiết bị vừa gửi kết quả của lệnh (ví dụ cmd = add_face_result)
  if (body.cmd && body.cmd.endsWith('_result')) {
    console.log('📩 Nhận kết quả từ thiết bị:', body);
    pendingCommand = null;
    return res.json({ code: 0, msg: 'Result received' });
  }

  // Nếu là heartbeat thông thường
  console.log('💓 Nhận heartbeat từ thiết bị:', body.device_info?.device_no || 'unknown');

  // Giả lập: khi nhận heartbeat đầu tiên, gửi lại 1 lệnh cho thiết bị lấy dữ liệu người dùng (cố định)
  if (!pendingCommand) {
    pendingCommand = {
        version: '0.2',
        cmd: 'request app params',
        command_id: 'thctdemo-quang',
        role: -1,
        page_no: 1,
        page_size: 10,
        feature_flag: 1,
        image_flag: 1,  // lấy reg_image khi chuyển đổi luôn thêm data:image/jpeg;base64,....
        query_mode: 0,
        condition: {
            person_id: '20251028160500980',
            person_name: 'Nguyễn Trí Quãng'
        }
    };
    console.log('🚀 Gửi lệnh điều khiển:', pendingCommand);
    return res.json(pendingCommand);
  }

  // Nếu không có lệnh nào, chỉ trả về OK (sau 3 giây tránh loop nhanh)
  setTimeout(() => {
    res.json({ code: 0, msg: 'heartbeat ok' });
  }, 3000);
};
