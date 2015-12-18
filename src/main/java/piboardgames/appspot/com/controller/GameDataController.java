
package my.template.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Date;


@Controller
@RequestMapping("/gamedata")
public class GameDataController {

	static Map<String, GameData> gameDataMap = Collections.synchronizedMap(new HashMap<String, GameData>());
	static int checkCounter = 0;

	@RequestMapping(value = "/{gameid}", method = RequestMethod.GET)
		public String getGameData(@PathVariable String gameid, HttpServletResponse response) {
			try {
				response.getOutputStream().print(gameDataMap.get(gameid).getGameData());
				response.getOutputStream().flush();
			} catch (IOException ioe) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			} catch (Exception e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			return null;
		}

	@RequestMapping(value = "/{gameid}", method = RequestMethod.POST)
		public void setGameData(@RequestBody String body, @PathVariable String gameid, HttpServletResponse response) {
			GameData gd = gameDataMap.get(gameid);
			if (gd == null) {
				gd = new GameData();
			} 
			gd.setGameData(body);
			gd.setLastRefreshTime(new Date());
			gameDataMap.put(gameid, gd);
			checkCounter++;
			if (checkCounter > 10000) {
				checkCounter = 0;
				List<String> idsToRemove = new ArrayList<String>();
				long now = (new Date()).getTime();
				for (String gid : gameDataMap.keySet()) {
					gd = gameDataMap.get(gid);
					if (now - gd.getLastRefreshTime().getTime() > 172800000) {
						idsToRemove.add(gid);
					}
				}
				for (String gid : idsToRemove) {
					gameDataMap.remove(gid);
				}
			}
		}

	@RequestMapping(value = "/{gameid}/hash", method = RequestMethod.GET)
		public String getGameDataHash(@PathVariable String gameid, HttpServletResponse response) {
			try {
				GameData gd = gameDataMap.get(gameid);
				String data = null;
				if (gd != null) {
					data = gameDataMap.get(gameid).getGameData();
				}
				String hash = data == null? null: ("" + data.hashCode());
				response.getOutputStream().print(hash);
				response.getOutputStream().flush();
			} catch (IOException ioe) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			return null;
		}


	@RequestMapping(value = "/count", method = RequestMethod.GET)
		public String getGameDataCount(HttpServletResponse response) {
			try {
				String count = "" + gameDataMap.size();
				response.getOutputStream().print(count);
				response.getOutputStream().flush();
			} catch (IOException ioe) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}
			return null;
		}


	class GameData {
		String gameData;
		Date lastRefreshTime;

		public String getGameData() {
			return gameData;
		}

		public void setGameData(String gameData) {
			this.gameData = gameData;
		}

		public Date getLastRefreshTime() {
			return lastRefreshTime;
		}

		public void setLastRefreshTime(Date lastRefreshTime) {
			this.lastRefreshTime = lastRefreshTime;
		}
	}
}
