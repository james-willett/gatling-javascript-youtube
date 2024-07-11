import { atOnceUsers, scenario, simulation, jmesPath, csv, pause, feed } from "@gatling.io/core";
import { http, status } from "@gatling.io/http";

export default simulation((setUp) => {
  // Http Protocol
  const httpProtocol = http
    .baseUrl("https://www.videogamedb.uk/api/v2")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json");

  // Feeder for test data
  const feeder = csv("videogames.csv").random();

  // Scenario
  const myScenario = scenario("My Scenario").exec(
    http("Get All Games").get("/videogame")
        .check(status().is(200))
        .check(jmesPath("[0].id").saveAs("firstGameId")),
    pause(5),
    http("Get Single Game").get("/videogame/#{firstGameId}")
        .check(status().is(200))
        .check(jmesPath("name").is("Resident Evil 4")),
    pause(2),
    feed(feeder),
    http("Get Game: #{gameName}").get("/videogame/#{gameId}")
        .check(jmesPath("name").isEL("#{gameName}"))
    );

  // setUp block
  setUp(myScenario.injectOpen(atOnceUsers(1))).protocols(httpProtocol);
});
