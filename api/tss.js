export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'กรุณาระบุข้อความ (text)' });
        }

        // เรียกใช้ AI For Thai Text-to-Speech (Vaja9)
        const response = await fetch('https://api.aiforthai.in.th/vaja9/synth_audiovisual', {
            method: 'POST',
            headers: {
                'Apikey': 'XttDXVy5Om1SG2nHHeN9xLcsYMsRhXG6',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input_text: text,
                speaker: 1,
                phrase_break: 0,
                audiovisual: 0
            })
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('AI For Thai TTS Error:', error);
        return res.status(500).json({ error: 'TTS API Error', details: error.message });
    }
}