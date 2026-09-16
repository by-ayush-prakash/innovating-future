const cut = 'fill="var(--card-icon-cutout)"';
const icons: Record<string,string> = {
 evidence:`<path d="M3 32S14 12 32 12s29 20 29 20-11 20-29 20S3 32 3 32Z"/><circle cx="32" cy="32" r="13" ${cut}/><circle cx="32" cy="32" r="7"/>`,
 learning:`<path d="M4 12Q18 8 30 14v43Q17 51 4 54Zm30 2Q46 8 60 12v42Q47 51 34 57Z"/>`,
 understanding:`<path d="M29 8C13 8 3 18 3 30c0 7 3 12 8 16L8 56l14-7h7c16 0 26-9 26-19S45 8 29 8Z"/><circle cx="18" cy="30" r="3" ${cut}/><circle cx="29" cy="30" r="3" ${cut}/><circle cx="40" cy="30" r="3" ${cut}/>`,
 judgment:`<path d="M17 35V12a4 4 0 0 1 8 0v17-22a4 4 0 0 1 8 0v22-18a4 4 0 0 1 8 0v19-13a4 4 0 0 1 8 0v24c0 10-5 15-8 18v5H23v-7c-8-5-13-15-15-22-2-7 4-10 7-4l5 9Z"/>`,
 work:`<path d="M10 3h28l15 15v38H10Z"/><path d="M37 3v16h16" ${cut}/><rect x="16" y="26" width="24" height="3" rx="1" ${cut}/><rect x="16" y="33" width="18" height="3" rx="1" ${cut}/><circle cx="46" cy="47" r="15" ${cut}/><circle cx="46" cy="47" r="12"/><path d="M49 41c-6-4-10 4-3 6s3 10-3 6m3-15v18" fill="none" stroke="var(--card-icon-cutout)" stroke-width="2"/>`,
 creativity:`<path d="m10 44 29-29 12 12-29 29H10Zm32-32 5-5c6-6 18 6 12 12l-5 5Z"/><rect x="33" y="53" width="25" height="3" rx="1"/><rect x="42" y="45" width="16" height="3" rx="1"/>`,
 relationships:`<circle cx="43" cy="18" r="12"/><path d="M29 58V44c0-14 34-14 34 0v14Z"/><circle cx="23" cy="18" r="12" stroke="var(--card-icon-cutout)" stroke-width="3"/><path d="M5 58V44c0-14 36-14 36 0v14Z" stroke="var(--card-icon-cutout)" stroke-width="3"/>`,
 wellbeing:`<rect x="8" y="3" width="34" height="56" rx="7"/><rect x="19" y="5" width="13" height="4" rx="2" ${cut}/><path d="M42 32c-12-17-30 1-18 13l18 16 18-16c12-12-6-30-18-13Z" stroke="var(--card-icon-cutout)" stroke-width="3"/>`,
 privacy:`<path d="m32 3 29 14-29 15L3 17Zm-23 24 23 12 23-12 6 6-29 16L3 33Zm0 17 23 12 23-12 6 6-29 14L3 50Z"/>`,
 governance:`<path d="M29 3a29 29 0 1 0 32 32H29Z"/><path d="M33 2v29h29A29 29 0 0 0 33 2Z"/>`,
};
const palettes: Record<string,[string,string,string]> = {
 evidence:['#e1efd8','#afd19b','#42633c'], learning:['#e6dfed','#c4a5df','#705187'],
 understanding:['#fbe6d2','#efba91','#a96235'], judgment:['#f7efc9','#ecd575','#887021'],
 work:['#dbeaf2','#a9ccdf','#3f687e'], creativity:['#f1dfe7','#dca9bf','#8b4c68'],
 relationships:['#dceee8','#a8d1c1','#3d7460'], wellbeing:['#e4e7f6','#b7bfe7','#535e96'],
 privacy:['#f0e6d8','#d8bd96','#81643c'], governance:['#e4ecdb','#bdd09f','#617b40'],
};
export function recordCardVisual(id:string) {
 const [rest,selected,ink]=palettes[id];
 return {rest,selected,ink,svg:`<svg class="record-topic-icon" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">${icons[id]}</svg>`};
}
