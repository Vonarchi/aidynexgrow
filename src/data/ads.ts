// Showcase spots produced by Adynex with AI (Higgsfield). Each spot = 3 clips played back to back (~30s).
// These are spec ads (concept work for each industry), not client commercials. Label them that way.

const cdn = (id: string) => `https://d8j0ntlcm91z4.cloudfront.net/user_3KVHQiUcU0um2bCKjEFnZiJyhfA/${id}.mp4`

export type ShowcaseAd = { industry: string; title: string; line: string; clips: string[] }

export const showcaseAds: ShowcaseAd[] = [
  { industry: 'Restaurant', title: 'Fire. Craft. Family.', line: 'From the flame to the table.', clips: [cdn('hf_20261101_214310_48c0c071-a0d8-4abf-830b-5a675982d8af'), cdn('hf_20261101_214309_07d945ca-be8c-404b-aad8-8eca3ee9140c'), cdn('hf_20261101_214309_e0988601-9ed2-42d0-88fd-110024d6e30f')] },
  { industry: 'Dental', title: 'Smile like you mean it.', line: 'Gentle care, confident smiles.', clips: [cdn('hf_20261101_214327_54562afd-8fbf-400b-8962-5d32129cf77a'), cdn('hf_20261101_214327_f8a3151a-a1ac-4145-96a3-42da15dc6ce1'), cdn('hf_20261101_214327_1919cae4-1894-4338-818b-508c427786a8')] },
  { industry: 'Home services', title: 'Cool, before you know it.', line: 'The hero arrives at dusk.', clips: [cdn('hf_20261101_214327_d3e14afb-4dfe-433d-aaa5-ea570daf7be3'), cdn('hf_20261101_214309_2d3362de-25e0-4e45-9ab0-d6aa446f2aa7'), cdn('hf_20261101_214309_0cb86dce-d179-4547-98e9-a671bd2da2a6')] },
  { industry: 'Barbershop', title: 'Walk out a new man.', line: 'Razor, fade, reveal.', clips: [cdn('hf_20261101_214309_1c352003-0a16-44be-bf84-206b49c8472a'), cdn('hf_20261101_214309_78422c8b-daad-4b65-9bc8-ac7340bdcb51'), cdn('hf_20261101_214327_14913803-1f9d-4510-9e8d-b02324f5bf09')] },
  { industry: 'Church', title: "There's a place for you.", line: 'Sunrise, song, family.', clips: [cdn('hf_20261101_214315_b28ed0f1-70e2-43d5-bb5a-4a9fa8927196'), cdn('hf_20261101_214316_8feef7c4-555b-4007-ae56-da944a488ae2'), cdn('hf_20261101_214315_483d82fe-ab53-4839-a085-86a76d25f2e0')] },
]
