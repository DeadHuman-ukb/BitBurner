/** @param {NS} ns */
export async function main(ns) {
	const port = ns.getPortHandle(1)
	while (true) {
		while (port.empty()) {
			await ns.sleep(100)
		}
		const target = port.peek()
		await ns.weaken(target);
	}
}
