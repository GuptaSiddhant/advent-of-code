import { Part, WorkflowMap, checkIfPartAccepted } from "./19.helper.ts";

type Data = {
  minPart: Part;
  maxPart: Part;
  workflows: WorkflowMap;
};

self.addEventListener("message", (event: any) => {
  const minPart = (event.data as Data).minPart;
  const maxPart = (event.data as Data).maxPart;
  const workflows = (event.data as Data).workflows;
  let accepted = 0;

  for (let x = minPart.x; x <= maxPart.x; x++) {
    for (let m = minPart.m; m <= maxPart.m; m++) {
      for (let a = minPart.a; a <= maxPart.a; a++) {
        for (let s = minPart.s; s <= maxPart.s; s++) {
          if (checkIfPartAccepted({ x, m, a, s }, workflows, "in")) {
            accepted++;
          }
        }
      }
    }
  }

  (self as any).postMessage(accepted);
  self.close();
});
