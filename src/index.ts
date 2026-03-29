export async function fetchUser(username: string): Promise<any> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

function printHelp() {
  console.log(`\nUsage: bun run src/index.ts [username]\n`);
  console.log("Fetches GitHub user data for the given username.\n");
  console.log("Arguments:");
  console.log("  username   GitHub username to fetch (default: milliorn)\n");
}

async function main(args: string[] = process.argv.slice(2)) {
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }
  const username = args[0] || "milliorn";
  try {
    const data = await fetchUser(username);
    console.log("User data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
