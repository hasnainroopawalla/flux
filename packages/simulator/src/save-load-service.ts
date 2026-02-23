import type { Simulator } from "./simulator";

export class SaveLoadService {
	private sim: Simulator;

	constructor(sim: Simulator) {
		this.sim = sim;
	}

	public save() {
		const bp = this.sim.blueprintService.saveBlueprint("ok");
		console.log(bp);
	}

	public load() {}
}
