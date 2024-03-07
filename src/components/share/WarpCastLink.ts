export function createWarpcastLink(text: string, embeds: string[]): string {
    const baseUrl = 'https://warpcast.com/~/compose?';
    const textParam = `text=${encodeURIComponent(text)}`;
    const embedsParam = embeds.map((embed, index) => `embeds[]=${embed}`).join(',');
    return `${baseUrl}${textParam}&${embedsParam}`;
}

//http://localhost:5173/joingame?sessionId=mk-pbid-1285ad7d-666d-4bc8-8ae4-9c07f62fd344&channelId=tm-chid-b7e6f8ca-5514-4dc4-b25c-dc9dd9bea26d

// bad
// https://warpcast.com/~/compose?text=Let%27s%20continue%20playing%20our%20game!&embeds[]=http%3A%2F%2Flocalhost%3A5173%2Fjoingame%3FsessionId%3Dmk-pbid-f5bc66a6-5c38-4266-925f-20e9db69960c%26channelId%3Dtm-chid-54a8363d-de9e-4a67-b81d-c63b1fdad376

// good
// https://warpcast.com/~/compose?text=The%20best%20essay%20for%20understanding%20why%20people%20use%20new%20social%20networks&embeds[]=https://trivia-monkey-client.vercel.app/