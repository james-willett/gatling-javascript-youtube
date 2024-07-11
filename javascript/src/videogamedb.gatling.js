import { atOnceUsers, scenario, simulation, pause } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

export default simulation((setUp) => {
  // Http Protocol
  const httpProtocol = http
    .baseUrl("https://www.videogamedb.uk/api/v2")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json");

  // Scenario
  const myScenario = scenario("My Scenario").exec(
    http("Get All Games").get("/videogame")
        .check(status().is(200)),
    pause(5),
    http("Get Single Game").get("/videogame/1")
        .check(status().is(200))
    );

  // setUp block
  setUp(myScenario.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
});
