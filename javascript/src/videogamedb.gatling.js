import { atOnceUsers, scenario, simulation, jmesPath } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

export default simulation((setUp) => {
  // Http Protocol
  const httpProtocol = http
    .baseUrl("https://www.videogamedb.uk/api/v2")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json");

  // Scenario
  const myScenario = scenario("My Scenario")
  .exec(http("Get All Games").get("/videogame")
        .check(status().is(200))
        .check(jmesPath("[0].id").saveAs("firstGameId"))
    )
  .exec(http("Get Single Game").get("/videogame/#{firstGameId}")
        .check(status().is(200))
        .check(jmesPath("name").is("Resident Evil 4"))
    );

  // setUp block
  setUp(myScenario.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
});
