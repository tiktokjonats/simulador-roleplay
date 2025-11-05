// api/saveConversation.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!body || !body.session_id || !body.messages) {
      return res.status(400).json({ ok: false, error: 'Faltan datos obligatorios (session_id, messages)' });
    }

    const insertObj = {
      session_id: body.session_id,
      advisor_name: body.advisor_name || null,
      client_name: body.client_name || null,
      client_doc: body.client_doc || null,
      client_type: body.client_type || null,
      metadata: body.metadata || null,
      messages: body.messages,
      transcript: (body.messages || []).map(m => m.text).join('\n'),
      breakpoints: (body.messages || [])
        .filter(m => m.breakpoint)
        .map(m => ({ text: m.text, bp: m.breakpoint })),
    };

    const { data, error } = await supabase
      .from('conversations')
      .insert([insertObj])
      .select()
      .single();

    if (error) throw error;

    res.json({ ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message || 'Error desconocido' });
  }
}
