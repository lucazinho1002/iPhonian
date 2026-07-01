"use strict";

// Helpers to make cassowary.js a bit clearer.
var weak = c.Strength.weak;
var medium = c.Strength.medium;
var strong = c.Strength.strong;
var required = c.Strength.required;

var eq  = function(a1, a2, strength, w) {
  return new c.Equation(a1, a2, strength || weak, w||0);
};
var neq = function(a1, a2, a3) { return new c.Inequality(a1, a2, a3); };
var geq = function(a1, a2, str, w) { return new c.Inequality(a1, c.GEQ, a2, str, w); };
var leq = function(a1, a2, str, w) { return new c.Inequality(a1, c.LEQ, a2, str, w); };

var stay = function(v, strength, weight) {
  return new c.StayConstraint(v, strength||weak, weight||0);
};
var weakStay =     function(v, w) { return stay(v, weak,     w||0); };
var mediumStay =   function(v, w) { return stay(v, medium,   w||0); };
var strongStay =   function(v, w) { return stay(v, strong,   w||0); };
var requiredStay = function(v, w) { return stay(v, required, w||0); };

function multiTaskView(appContainer, data) {
    "use strict";

    var context = new MotionContext(),
        solver = context.solver(),
        scale = 0.42,
        lastApp = null,
        apps = [],
        APP_WIDTH = 640,
        APP_HEIGHT =  360,
        GROWTH_FACTOR = 0.02,
        X_MARGIN = 60,
        Y_MARGIN = 50,
        // (left) space between apps
        LEFT_GAP = 5,
        // (right) space after apps are moved
        RIGHT_GAP = APP_WIDTH * -0.2;

    for (var i = 0; i < data.length; i++) {
        var node = document.createElement("div"),
            app = new Box(node),
            growthFactor = i * GROWTH_FACTOR,
            h = APP_HEIGHT * (growthFactor / 2),
            w = APP_WIDTH * growthFactor,

            // Create the HTML structure
            screen = document.createElement("iframe"),
            title = document.createElement("span"),
            icon = document.createElement("img");

        screen.src = data[i].image;
		screen.width = "640px";
		screen.height = "360px";
		screen.frameBorder  = 0;
		
		
		
		
        icon.src = data[i].icon;
        title.appendChild(icon);
        title.appendChild(document.createTextNode(data[i].name));

        node.className = "app";
		node.onclick = function () {
		alert("ad");
		};
        node.appendChild(title);
        node.appendChild(screen);
		

        // Create the constraints
        app.x = new c.Variable({ name: "app-" + i + "-x" });
        app.right = new c.Variable({ name: "app-" + i + "-right" });
        app.edge = new c.Variable({ name: "app-" + i + "-right-edge" });
        app.y = Y_MARGIN - h;
        app.bottom = APP_HEIGHT + h;
		
        // App's width
        solver.add(eq(app.right, c.plus(app.x, APP_WIDTH + w), medium));

        // App's right gap
        solver.add(eq(app.edge, c.plus(app.right, RIGHT_GAP), medium));

        // Pin the first app to 0, and add a motion constraint
        if (i === 0) {
            solver.add(eq(app.x, 0, weak, 100));
            context.addMotionConstraint(new MotionConstraint(app.x, ">=", 0));
            context.addMotionConstraint(new MotionConstraint(app.x, "<=", X_MARGIN));
        } else {
            // The app mustn't reveal any space between it and the previous app.
            solver.add(leq(app.x, apps[i-1].edge, medium, 0));

            // Make the app tend toward the left (zero). Use a lower priority than
            // the first app so the solver will prefer for the first app to be
            // zero than any of the additional apps.
            solver.add(eq(app.x, 0, weak, 0));

            // The app must be to the right of the previous app's left edge, plus the left gap
            solver.add(geq(app.x, c.plus(apps[i-1].x, LEFT_GAP), medium, 0));
					
						// We constrain on the gap between this app and the one that came before
						// it. So first, create a variable that will be the gap to constrain on.
						var gap = new c.Variable();

						// gap = apps[i].x - apps[i-1].x
						solver.add(eq(gap, c.minus(app.x, apps[i-1].x)));

						// Use the OR operator for the motion constraint. Eiher the gap is LEFT_GAP
						// or it should be APP_WIDTH.
						// This constraint is captive (it will be enforced even if we'd go through it)
						// This constraint isn't active when dragging (overdragCoefficient: 0)
					  
					  // context.addMotionConstraint(new MotionConstraint(gap, '||', [LEFT_GAP, APP_WIDTH], {
						// 	 overdragCoefficient: 0,
						// 	 captive: true
						// }));
        }

        apps.push(app);
        context.addBox(app);
        appContainer.appendChild(app.element());
        lastApp = app;
    }

    // Modify CSS properties to maintain a clear view of the apps
    for (var i = 0; i < apps.length - 1; i++) {
        attachObserver(apps[i], apps[i + 1]);
    };

    // Make a manipulator. It takes touch events and updates a constrained variable
    // from them.
    var handler = new Manipulator(lastApp.x, appContainer, "x");
    context.addManipulator(handler);
}

function attachObserver (current, next) {
    "use strict";

    var offset = 40,
        $current = current.element(),
        $next = next.element(),
        observer = new MutationObserver(function(mutations) {
            var mutation = mutations[mutations.length - 1];
                if (mutation.attributeName === "style") {

                // e.g., translate3d(4px, 64px, 0px)
                var transform = mutation.target.style.transform,
                    values = transform
                                .replace(/translate3d\(|\s|\)/g, "")
                                .split(","),
                    distance = next.x.value - current.x.value,
                    factor = (distance / offset);

                factor = factor > 1 ? 1 : factor;

                var opacity = factor,
                    blur = "blur(" + ((1 - factor) * 15) + "px)";

                $current.style["-webkit-filter"] = blur;
                $current.style["-moz-filter"] = blur;
                $current.style["-o-filter"] = blur;
                $current.style.filter = blur;

                // $current.style.opacity = opacity;
            }
        });

    observer.observe($next, {
        attributes: true,
        childList: false,
        characterData: false
    });
}

var base = "http://jachinte.github.io/examples/ios9-multitask/",
		data = [
    	{image: base + "images/1.jpg", name: "Cool Name", icon: base + "images/icons/1.png"},
    	{image: base + "images/2.jpg", name: "Rock & Roll", icon: base + "images/icons/2.png"},
    	{image: base + "images/3.jpg", name: "Best App", icon: base + "images/icons/3.png"},
    	{image: base + "images/4.jpg", name: "Cool Name", icon: base + "images/icons/4.png"},
    	{image: base + "images/5.jpg", name: "Rock & Roll", icon: base + "images/icons/5.png"},
    	{image: base + "images/6.jpg", name: "Best App", icon: base + "images/icons/6.png"},
    	{image: base + "images/7.jpg", name: "Cool Name", icon: base + "images/icons/7.png"}
		];

window.addEventListener('load', function () {
	//multiTaskView(document.getElementById("multitask-view"), data);
});