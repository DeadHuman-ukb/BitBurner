/** @param {NS} ns */
export async function main(ns) {
    let servers = serverList(ns);
    let cracks = availablePortOpeners(ns);
    const port = ns.getPortHandle(1);
    let numCracksAvailable = cracks.length;
    let files = ["weaken.js", "autohack.js", "grow.js"];
    var target;
	ns.disableLog("getServerNumPortsRequired");
    for (const server of servers) {
        let portRequirement = ns.getServerNumPortsRequired(server);
        if (!ns.getPurchasedServers().includes(server)) {
            if (portRequirement <= numCracksAvailable) {
                for (const crack of cracks) {
                    crack(server);
                }
                ns.nuke(server);
                if (ns.getHackingLevel() <= 10) {
                    target = "n00dles";
                }
                if (ns.getHackingLevel() >= 10 && ns.getHackingLevel() <= 250) {
                    if (target != "joesguns") {
                        ns.killall(server);
                        target = "joesguns";
                    }
                }
                if (ns.getHackingLevel() >= 250) {
                    if (target != "phantasy") {
                        ns.killall(server);
                        target = "phantasy";
                    }
                }
                if (port.peek() !== target) {
                    port.clear();
                    port.write(target);
                }
                await ns.sleep(100)
                ns.scp(files, server, "home");
                ns.exec("autohack.js", server, 5, target);
                ns.exec("weaken.js", server, 5, target);
            }
        }
    }
    ns.exec("autohack.js", "home", 5, target);
    await ns.sleep(100);
    ns.exec("weaken.js", "home", 5, target);

}
export function serverList(ns) {
    let servers = ["home"];
    for (const server of servers) {
        const found = ns.scan(server);
        if (server != "home") found.splice(0, 1);
        servers.push(...found);
    }
    return servers;
}
export function availablePortOpeners(ns) {
    const cracklist = [
        ["BruteSSH.exe", ns.brutessh],
        ["FTPCrack.exe", ns.ftpcrack],
        ["SQLInject.exe", ns.sqlinject],
        ["relaySMTP.exe", ns.relaysmtp],
        ["HTTPWorm.exe", ns.httpworm],
    ];
    let availableCracks = [];
    for (const crack of cracklist) {
        if (ns.fileExists(crack[0])) { availableCracks.push(crack[1]) }
    }
    return availableCracks;
}
