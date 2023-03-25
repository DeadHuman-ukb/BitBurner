/** @param {NS} ns */
export async function main(ns) {
	const port = ns.getPortHandle(1)
	while (true) {
		while (port.empty()) {
			await ns.sleep(100)
		}
		const target = port.peek()
		var moneyThresh = ns.getServerMaxMoney(target) * 0.5;
		var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
		if (ns.getServerSecurityLevel(target) > securityThresh) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}
