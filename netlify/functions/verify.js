exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors() };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: cors(), body: 'Method Not Allowed' };

  try {
    const { code } = JSON.parse(event.body || '{}');
    const input = String(code || '').toUpperCase();

    const allow = (process.env.CODES_PLAINTEXT || '')
      .split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

    const block = (process.env.CODES_BLOCKLIST || '')
      .split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

    const ok = !!input && allow.includes(input) && !block.includes(input);
    return { statusCode: 200, headers: { ...cors(), 'Content-Type':'application/json' }, body: JSON.stringify({ ok }) };
  } catch {
    return { statusCode: 400, headers: cors(), body: JSON.stringify({ ok:false, error:'Bad Request' }) };
  }
};

function cors(){
  return {
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'Content-Type',
    'Access-Control-Allow-Methods':'POST,OPTIONS',
  };
}
