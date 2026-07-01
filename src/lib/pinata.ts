export const SBT_BADGES = [
  {
    id: "badge_1",
    name: "Verified Blockchain Developer",
    description: "Successfully deployed and verified 5 smart contracts.",
    imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicvjk2jjxapwz367fainadzmsefqlrw2pxuxc3rynkdanoa2oqtfu"
  },
  {
    id: "badge_2",
    name: "AI & Machine Learning Specialist",
    description: "Completed top-tier deep learning curriculum.",
    imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreifyv25g6ljkb7evesvyl5eggwzo435yjyhse2gv2eggc6meyatjyi"
  },
  {
    id: "badge_3",
    name: "Elite Frontend Engineer",
    description: "Demonstrated extreme proficiency in React and Web3 integrations.",
    imageURI: "https://scarlet-big-possum-145.mypinata.cloud/ipfs/bafkreicd4klxcqzhv3kbzbn3otbqttosqox5h3qjbr474u7ogp2fyy3ysm"
  }
];

export async function uploadMetadataToPinata(metadata: any): Promise<string> {
  // If the user hasn't provided a JWT to dynamically upload, we can simulate returning one of the hardcoded IPFS links based on the skill
  console.log("Mocking Pinata upload for:", metadata);
  
  if (metadata.name.includes("Blockchain")) {
    return SBT_BADGES[0].imageURI;
  } else if (metadata.name.includes("AI") || metadata.name.includes("Machine Learning")) {
    return SBT_BADGES[1].imageURI;
  } else {
    return SBT_BADGES[2].imageURI;
  }
}
