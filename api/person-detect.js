export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ error: 'กรุณาส่งข้อมูลรูปภาพ (imageBase64)' });
        }

        // แปลง Data URL (data:image/jpeg;base64,...) เป็น Buffer ไฟล์ JPG
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // สร้าง multipart/form-data สำหรับส่งไฟล์ src_img (.jpg) ตามสเปก AI For Thai Person Detection
        const formData = new FormData();
        const imageBlob = new Blob([imageBuffer], { type: 'image/jpeg' });
        formData.append('src_img', imageBlob, 'capture.jpg');
        formData.append('json_export', 'true');
        formData.append('img_export', 'true');

        const apiResponse = await fetch('https://api.aiforthai.in.th/person/human_detect/', {
            method: 'POST',
            headers: {
                'Apikey': 'XttDXVy5Om1SG2nHHeN9xLcsYMsRhXG6'
            },
            body: formData
        });

        const rawText = await apiResponse.text();
        let parsedData;
        try {
            parsedData = JSON.parse(rawText);
        } catch {
            parsedData = { raw: rawText };
        }

        return res.status(apiResponse.status).json(parsedData);
    } catch (error) {
        console.error('Person Detection Proxy Error:', error);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเชื่อมต่อ Person Detection API', details: error.message });
    }
}