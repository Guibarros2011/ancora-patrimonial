export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const { socio, voto, duvidas, data } = await context.request.json();

    if (!socio || !voto) {
      return new Response(JSON.stringify({ ok: false, erro: 'Campos obrigatórios ausentes.' }), { status: 400, headers: corsHeaders });
    }

    const htmlContent = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FAFAF8; padding: 0;">
        <div style="background: #111111; border-bottom: 2px solid #C8A84B; padding: 32px 40px;">
          <p style="font-size: 11px; letter-spacing: 0.15em; color: #C8A84B; text-transform: uppercase; margin: 0 0 8px;">Âncora Patrimonial · Barros &amp; Ferreira Holding</p>
          <h1 style="font-size: 22px; color: #FAFAF8; margin: 0; font-weight: 700;">Avaliação de Sócio Fundador</h1>
        </div>
        <div style="padding: 36px 40px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #2A2A2A; font-size: 12px; color: #888880; letter-spacing: 0.06em; width: 40%;">SÓCIO</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #2A2A2A; font-size: 15px; color: #FAFAF8; font-weight: 500;">${socio}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #2A2A2A; font-size: 12px; color: #888880; letter-spacing: 0.06em;">DATA</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #2A2A2A; font-size: 15px; color: #FAFAF8;">${data}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; font-size: 12px; color: #888880; letter-spacing: 0.06em; vertical-align: top; padding-top: 16px;">POSIÇÃO</td>
              <td style="padding: 12px 0; padding-top: 16px;">
                <span style="display: inline-block; background: rgba(200,168,75,0.12); border: 1px solid #C8A84B; color: #C8A84B; padding: 6px 16px; font-size: 13px; font-weight: 500;">${voto}</span>
              </td>
            </tr>
          </table>

          ${duvidas && duvidas !== 'Nenhum comentário adicional.' ? `
          <div style="background: #1A1A1A; border-left: 2px solid #C8A84B; padding: 20px 24px; margin-top: 8px;">
            <p style="font-size: 11px; color: #C8A84B; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 10px;">Dúvidas / Comentários</p>
            <p style="font-size: 14px; color: #E8E6E0; line-height: 1.7; margin: 0;">${duvidas.replace(/\n/g, '<br>')}</p>
          </div>
          ` : `
          <div style="background: #1A1A1A; padding: 16px 24px; margin-top: 8px;">
            <p style="font-size: 13px; color: #888880; margin: 0; font-style: italic;">Nenhum comentário adicional.</p>
          </div>
          `}
        </div>
        <div style="padding: 20px 40px; border-top: 1px solid #2A2A2A;">
          <p style="font-size: 11px; color: #555550; margin: 0; letter-spacing: 0.04em;">Enviado via hotsite Âncora Patrimonial · Confidencial · Barros &amp; Ferreira · Belo Horizonte, MG</p>
        </div>
      </div>
    `;

    const payload = {
      sender: { name: 'Âncora Patrimonial', email: 'sistema@storiaforge.com' },
      to: [
        { email: 'guibarros2011@gmail.com', name: 'Guilherme Barros' },
        { email: 'alessandra_helcar@gmail.com', name: 'Alessandra Ferreira' },
        { email: 'postohelcar2025@gmail.com', name: 'Posto Helcar' },
      ],
      subject: `Âncora Patrimonial — Avaliação de ${socio}`,
      htmlContent,
    };

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': context.env.BREVO_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!brevoRes.ok) {
      const err = await brevoRes.text();
      console.error('Brevo error:', err);
      return new Response(JSON.stringify({ ok: false, erro: 'Falha ao enviar email.' }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });

  } catch (e) {
    console.error('enviar error:', e);
    return new Response(JSON.stringify({ ok: false, erro: e.message }), { status: 500, headers: corsHeaders });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
