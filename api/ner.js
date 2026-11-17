export default async function handler(req, res) {
    // อนุญาตเฉพาะการส่งข้อมูลแบบ POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text } = req.body || {};
    if (!text) {
        return res.status(400).json({ error: 'Missing text parameter' });
    }

    const API_KEY = process.env.AIFORTHAI_API_KEY || "XttDXVy5Om1SG2nHheN9xLcsYMsRhXG6";

    try {
        const response = await fetch('https://api.aiforthai.in.th/ner', {
            method: 'POST',
            headers: {
                'Apikey': API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ text })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to connect AI For Thai', details: error.message });
    }
}