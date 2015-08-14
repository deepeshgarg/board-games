
package my.template.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/main")
public class AppController {

	@RequestMapping("/hello")
		public ModelAndView helloWorld() {
			ModelAndView mav = new ModelAndView();
			mav.setViewName("hello");
			mav.addObject("message", "Hello World!");
			return mav;
		}

	@RequestMapping("/hi")
		public ModelAndView hiWorld() {
			ModelAndView mav = new ModelAndView();
			mav.setViewName("hi");
			return mav;
		}
}
