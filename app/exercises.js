/* NOVAFit · exercise library and workout templates
   About 150 exercises named like in the Strong app ("Bench Press (Barbell)"), the
   workout templates the plans use, and the checks for custom exercises.
   Pure data and functions without any DOM access, so they run in the browser
   (window.NFEx) and in Node for the tests in tests/exercises.test.js. */
(function (root) {
  "use strict";

  // How a set is logged: w = weight × reps, r = reps only, a = assisted (kg of help × reps), t = time
  const TYPES = { w: "Weight × reps", r: "Reps only", a: "Assisted", t: "Time" };
  const PARTS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full body", "Cardio"];
  const EQUIP = ["Barbell", "Dumbbell", "Machine", "Cable", "Bodyweight", "Kettlebell", "Smith Machine", "EZ Bar", "Plate", "Assisted", "Other"];

  // Movement patterns: worked muscles (0–1), default sets × reps and rest in seconds,
  // and a short cue for exercises without their own. Exercises of the same
  // pattern are offered as alternatives when swapping.
  const PATTERNS = {
    hpress: { m: { chest: 1, triceps: .4, shoulders: .3 }, s: 3, r: [6, 10], rest: 120, cue: "Shoulder blades together and down, lower with control to your chest, press up." },
    ipress: { m: { chest: 1, shoulders: .5, triceps: .4 }, s: 3, r: [8, 12], rest: 90, cue: "Bench at about 30°, shoulder blades together, lower with control." },
    fly: { m: { chest: 1, shoulders: .2 }, s: 3, r: [10, 15], rest: 60, cue: "Slight bend in your elbows, open wide until you feel a stretch, then squeeze together." },
    pushup: { m: { chest: 1, triceps: .5, shoulders: .3, core: .3 }, s: 3, r: [8, 15], rest: 60, cue: "Body in one straight line, chest close to the floor, push the floor away." },
    dip: { m: { triceps: 1, chest: .6, shoulders: .3 }, s: 3, r: [6, 12], rest: 90, cue: "Shoulders down, lower until your elbows are at about 90°, push back up." },
    tpress: { m: { triceps: 1, chest: .6, shoulders: .2 }, s: 3, r: [8, 10], rest: 120, cue: "Hands shoulder-width, elbows close to your body, touch your lower chest." },
    vpull: { m: { back: 1, biceps: .4 }, s: 3, r: [8, 12], rest: 90, cue: "Chest up, pull your elbows down toward your hips, let the weight up slowly." },
    pullup: { m: { back: 1, biceps: .5, core: .2 }, s: 3, r: [5, 10], rest: 120, cue: "Start from a dead hang, pull until your chin is over the bar, lower slowly." },
    hrow: { m: { back: 1, biceps: .3, shoulders: .2 }, s: 3, r: [8, 12], rest: 90, cue: "Flat back, pull your elbows back past your body, squeeze your shoulder blades." },
    hinge: { m: { hams: .8, glutes: .8, lowback: .7, back: .4 }, s: 3, r: [5, 8], rest: 150, cue: "Bar close to your legs, flat back, push the floor away and finish with your glutes." },
    shrug: { m: { back: .6 }, s: 3, r: [10, 15], rest: 60, cue: "Arms long, lift your shoulders straight up, pause, lower slowly." },
    opress: { m: { shoulders: 1, triceps: .4, core: .2 }, s: 3, r: [6, 10], rest: 120, cue: "Core tight, press straight up, lower to chin height with control." },
    raise: { m: { shoulders: 1 }, s: 3, r: [12, 15], rest: 60, cue: "Light weight, raise to shoulder height, no swinging." },
    rear: { m: { shoulders: .8, back: .4 }, s: 3, r: [12, 15], rest: 60, cue: "Lead with your elbows, squeeze your upper back, return slowly." },
    curl: { m: { biceps: 1 }, s: 3, r: [10, 12], rest: 60, cue: "Elbows close to your body, curl up, lower slowly." },
    tri: { m: { triceps: 1 }, s: 3, r: [10, 12], rest: 60, cue: "Keep your upper arms still, extend fully, return with control." },
    squat: { m: { quads: 1, glutes: .7, adduct: .3, lowback: .2 }, s: 3, r: [8, 10], rest: 150, cue: "Brace your core, sit down between your heels, knees follow your toes, drive up." },
    lunge: { m: { glutes: .8, quads: .6, adduct: .2 }, s: 3, r: [10, 12], rest: 90, cue: "Long step, torso slightly forward, push up through your front heel. Reps per side." },
    rdl: { m: { hams: 1, glutes: .7, lowback: .4 }, s: 3, r: [8, 12], rest: 120, cue: "Soft knees, push your hips back, weight close to your legs, squeeze your glutes to stand." },
    thrust: { m: { glutes: 1, hams: .3 }, s: 3, r: [8, 12], rest: 120, cue: "Chin tucked, drive through your heels, pause for one second at the top." },
    kick: { m: { glutes: 1 }, s: 3, r: [12, 15], rest: 60, cue: "Hips still, push your leg back and slightly out, no arching. Reps per side." },
    abduct: { m: { glutes: .9 }, s: 3, r: [12, 15], rest: 60, cue: "Sit tall or lean forward, push your knees out, return slowly." },
    adduct: { m: { adduct: 1 }, s: 3, r: [12, 15], rest: 60, cue: "Squeeze your legs together slowly, hold for a second, open with control." },
    legext: { m: { quads: 1 }, s: 3, r: [10, 15], rest: 60, cue: "Pad on your shins, extend fully, pause, lower slowly." },
    legcurl: { m: { hams: 1 }, s: 3, r: [10, 12], rest: 60, cue: "Hips down, curl your heels toward your glutes, lower slowly." },
    calf: { m: { calves: 1 }, s: 3, r: [10, 15], rest: 60, cue: "Full stretch at the bottom, rise as high as you can, pause at the top." },
    plyo: { m: { quads: .7, glutes: .5, calves: .5 }, s: 3, r: [5, 8], rest: 90, cue: "Jump up explosively, land softly with bent knees, step down." },
    isoleg: { m: { quads: 1, glutes: .3 }, s: 3, r: [30, 45], rest: 60, cue: "Back flat against the wall, thighs parallel to the floor, hold." },
    abs: { m: { core: 1 }, s: 3, r: [10, 15], rest: 45, cue: "Exhale as you crunch, move slowly, keep your lower back under control." },
    hold: { m: { core: 1 }, s: 3, r: [30, 45], rest: 45, cue: "Brace your core and breathe steadily. Stop when your form breaks." },
    rot: { m: { core: 1 }, s: 3, r: [10, 12], rest: 45, cue: "Turn from your torso, not your arms, and control the way back." },
    olym: { m: { quads: .6, glutes: .6, hams: .5, back: .6, shoulders: .4 }, s: 3, r: [3, 5], rest: 150, cue: "Learn the technique with a light bar first. Explode from the floor, fast elbows." },
    swing: { m: { glutes: .9, hams: .6, core: .4, lowback: .3 }, s: 3, r: [12, 15], rest: 60, cue: "Hinge, snap your hips forward, let the bell float to chest height." },
    carry: { m: { core: .7, back: .5, shoulders: .3 }, s: 3, r: [30, 45], rest: 60, cue: "Stand tall, shoulders down, walk with short, steady steps." },
    cond: { m: { quads: .4, glutes: .3, core: .3, shoulders: .3 }, s: 3, r: [10, 15], rest: 60, cue: "Steady pace, keep good form even when you get tired." },
    cardio: { m: { quads: .3, calves: .3, hams: .2 }, s: 1, r: [10, 20], rest: 60, cue: "Start easy for two minutes, then hold a pace where you can still talk." }
  };

  // [id, name, equipment, body part, type, pattern, cue (optional), extra fields (optional)]
  // Ids of exercises that existed before v2.8 are kept, so older sessions still match.
  const ROWS = [
    // Chest
    ["bench", "Bench Press (Barbell)", "Barbell", "Chest", "w", "hpress", "Eyes under the bar, shoulder blades together, lower to your mid chest, press up and slightly back."],
    ["inclbb", "Incline Bench Press (Barbell)", "Barbell", "Chest", "w", "ipress"],
    ["declbb", "Decline Bench Press (Barbell)", "Barbell", "Chest", "w", "hpress"],
    ["flatdb", "Bench Press (Dumbbell)", "Dumbbell", "Chest", "w", "hpress", "Shoulder blades together, lower with control, press up."],
    ["incl", "Incline Bench Press (Dumbbell)", "Dumbbell", "Chest", "w", "ipress", "Bench at about 30°, shoulder blades together, lower with control."],
    ["dbfly", "Chest Fly (Dumbbell)", "Dumbbell", "Chest", "w", "fly"],
    ["incfly", "Incline Chest Fly (Dumbbell)", "Dumbbell", "Chest", "w", "fly"],
    ["pullover", "Pullover (Dumbbell)", "Dumbbell", "Chest", "w", "fly", "Lie across the bench, arms slightly bent, lower the dumbbell behind your head, pull back over your chest."],
    ["smithbench", "Bench Press (Smith Machine)", "Smith Machine", "Chest", "w", "hpress"],
    ["chestpress", "Chest Press (Machine)", "Machine", "Chest", "w", "hpress", "Handles at chest height, press forward, return slowly."],
    ["inclm", "Incline Chest Press (Machine)", "Machine", "Chest", "w", "ipress", "Set the seat so the handles are at chest height."],
    ["pecdeck", "Pec Deck (Machine)", "Machine", "Chest", "w", "fly"],
    ["crossover", "Cable Crossover", "Cable", "Chest", "w", "fly", "Step forward, slight lean, bring your hands together in front of your chest."],
    ["lowfly", "Low-to-High Cable Fly", "Cable", "Chest", "w", "fly", "Pulleys low, sweep your hands up to chin height, squeeze your upper chest."],
    ["pushup", "Push-up", "Bodyweight", "Chest", "r", "pushup"],
    ["incpushup", "Incline Push-up", "Bodyweight", "Chest", "r", "pushup", "Hands on a bench or box. The higher the hands, the easier it gets."],
    ["chestdip", "Chest Dip", "Bodyweight", "Chest", "r", "dip", "Lean forward to focus on your chest, lower until your elbows are at about 90°."],
    // Back
    ["deadlift", "Deadlift (Barbell)", "Barbell", "Back", "w", "hinge"],
    ["bbrow", "Bent Over Row (Barbell)", "Barbell", "Back", "w", "hrow", "Hinge to about 45°, flat back, pull the bar to your lower ribs."],
    ["pendlay", "Pendlay Row (Barbell)", "Barbell", "Back", "w", "hrow", "Torso parallel to the floor, row each rep from the floor."],
    ["rackpull", "Rack Pull (Barbell)", "Barbell", "Back", "w", "hinge"],
    ["tbar", "T-Bar Row", "Machine", "Back", "w", "hrow"],
    ["dbrow", "Single-Arm Row (Dumbbell)", "Dumbbell", "Back", "w", "hrow", "One knee and hand on the bench, pull the dumbbell to your hip. Reps per side."],
    ["csrow", "Chest-Supported Row (Dumbbell)", "Dumbbell", "Back", "w", "hrow", "Chest on an incline bench, pull both dumbbells back, squeeze your shoulder blades."],
    ["crow", "Seated Row (Cable)", "Cable", "Back", "w", "hrow", "Sit tall, pull the handle to your belly, shoulders back and down."],
    ["mrow", "Seated Row (Machine)", "Machine", "Back", "w", "hrow"],
    ["lat", "Lat Pulldown (Cable)", "Cable", "Back", "w", "vpull", "Chest out, lean back slightly, pull your elbows down toward your pockets."],
    ["latclose", "Close-Grip Lat Pulldown (Cable)", "Cable", "Back", "w", "vpull", "Chest out, pull your elbows down close to your body."],
    ["latone", "Single-Arm Lat Pulldown (Cable)", "Cable", "Back", "w", "vpull", "Pull your elbow toward your hip, keep your shoulder down. Reps per side."],
    ["straightarm", "Straight-Arm Pulldown (Cable)", "Cable", "Back", "w", "vpull", "Arms almost straight, sweep the bar down to your thighs."],
    ["pullup", "Pull-up", "Bodyweight", "Back", "r", "pullup"],
    ["chinup", "Chin-up", "Bodyweight", "Back", "r", "pullup", "Palms facing you, pull your chin over the bar, lower slowly."],
    ["invrow", "Inverted Row", "Bodyweight", "Back", "r", "hrow", "Under a bar or rings, body straight, pull your chest to the bar."],
    ["apullup", "Pull-up (Assisted)", "Assisted", "Back", "a", "pullup", "Knees on the pad, pull your chin over the bar, lower slowly. Log the kg of help: less help means stronger."],
    ["bbshrug", "Shrug (Barbell)", "Barbell", "Back", "w", "shrug"],
    ["dbshrug", "Shrug (Dumbbell)", "Dumbbell", "Back", "w", "shrug"],
    // Shoulders
    ["ohp", "Overhead Press (Barbell)", "Barbell", "Shoulders", "w", "opress"],
    ["pushpress", "Push Press (Barbell)", "Barbell", "Shoulders", "w", "opress", "Dip your knees slightly and drive the bar up with your legs and arms."],
    ["landmine", "Landmine Press", "Barbell", "Shoulders", "w", "opress", "One end of the bar in a corner, press the other end up and forward."],
    ["dbsp", "Shoulder Press (Dumbbell)", "Dumbbell", "Shoulders", "w", "opress", "Sit tall, dumbbells at ear height, press up without arching your back."],
    ["arnold", "Arnold Press (Dumbbell)", "Dumbbell", "Shoulders", "w", "opress", "Start with your palms facing you, rotate them forward as you press up."],
    ["msp", "Shoulder Press (Machine)", "Machine", "Shoulders", "w", "opress"],
    ["lra", "Lateral Raise (Dumbbell)", "Dumbbell", "Shoulders", "w", "raise", "Light weight, up to shoulder height, no swinging."],
    ["lracable", "Lateral Raise (Cable)", "Cable", "Shoulders", "w", "raise", "Lean slightly forward, raise to shoulder height. Reps per side."],
    ["lram", "Lateral Raise (Machine)", "Machine", "Shoulders", "w", "raise", "Lead with your elbows, pause briefly at the top."],
    ["frontdb", "Front Raise (Dumbbell)", "Dumbbell", "Shoulders", "w", "raise"],
    ["frontplate", "Front Raise (Plate)", "Plate", "Shoulders", "w", "raise"],
    ["revflydb", "Reverse Fly (Dumbbell)", "Dumbbell", "Shoulders", "w", "rear"],
    ["revflym", "Reverse Fly (Machine)", "Machine", "Shoulders", "w", "rear"],
    ["facepull", "Face Pull (Cable)", "Cable", "Shoulders", "w", "rear", "Rope at eye height, pull toward your face, elbows high, rotate your hands out."],
    ["uprow", "Upright Row (Cable)", "Cable", "Shoulders", "w", "raise", "Pull the bar up along your body to chest height, elbows lead."],
    // Arms
    ["bbcurl", "Biceps Curl (Barbell)", "Barbell", "Arms", "w", "curl"],
    ["bic", "Biceps Curl (Dumbbell)", "Dumbbell", "Arms", "w", "curl"],
    ["cablecurl", "Biceps Curl (Cable)", "Cable", "Arms", "w", "curl"],
    ["hammer", "Hammer Curl (Dumbbell)", "Dumbbell", "Arms", "w", "curl", "Palms facing each other, curl up, lower slowly."],
    ["inccurl", "Incline Curl (Dumbbell)", "Dumbbell", "Arms", "w", "curl", "Lie back on an incline bench, arms hang straight down, curl without moving your elbows."],
    ["conccurl", "Concentration Curl (Dumbbell)", "Dumbbell", "Arms", "w", "curl"],
    ["preacher", "Preacher Curl (EZ Bar)", "EZ Bar", "Arms", "w", "curl"],
    ["preacherm", "Preacher Curl (Machine)", "Machine", "Arms", "w", "curl"],
    ["bayes", "Bayesian Curl (Cable)", "Cable", "Arms", "w", "curl", "Face away from the cable, arm behind you, curl forward. Reps per side."],
    ["revcurl", "Reverse Curl (EZ Bar)", "EZ Bar", "Arms", "w", "curl", "Palms facing down, curl up slowly. Also trains your forearms."],
    ["pushdown", "Triceps Pushdown (Cable)", "Cable", "Arms", "w", "tri", "Elbows tight at your sides, push down until your arms are straight."],
    ["ropepd", "Rope Pushdown (Cable)", "Cable", "Arms", "w", "tri", "Spread the rope at the bottom, elbows stay at your sides."],
    ["ohcable", "Overhead Triceps Extension (Cable)", "Cable", "Arms", "w", "tri"],
    ["tri", "Overhead Triceps Extension (Dumbbell)", "Dumbbell", "Arms", "w", "tri"],
    ["skull", "Skullcrusher (EZ Bar)", "EZ Bar", "Arms", "w", "tri", "Lower the bar toward your forehead with your elbows pointing up, extend again."],
    ["cgbench", "Close-Grip Bench Press (Barbell)", "Barbell", "Arms", "w", "tpress"],
    ["tridip", "Triceps Dip", "Bodyweight", "Arms", "r", "dip", "Torso upright to focus on your triceps."],
    ["atridip", "Triceps Dip (Assisted)", "Assisted", "Arms", "a", "dip", "Torso upright, lower until your elbows are at 90°, push up. Log the kg of help: less help means stronger."],
    ["benchdip", "Bench Dip", "Bodyweight", "Arms", "r", "dip", "Hands on the bench behind you, lower until your elbows are at 90°."],
    ["kickback", "Triceps Kickback (Dumbbell)", "Dumbbell", "Arms", "w", "tri"],
    // Legs
    ["squat", "Squat (Barbell)", "Barbell", "Legs", "w", "squat", "Bar on your upper back, chest up, sit down until your thighs are parallel."],
    ["smithsq", "Squat (Smith Machine)", "Smith Machine", "Legs", "w", "squat", "Feet slightly in front of the bar, chest up, sit down until your thighs are parallel."],
    ["frontsq", "Front Squat (Barbell)", "Barbell", "Legs", "w", "squat", "Bar on the front of your shoulders, elbows high, sit straight down."],
    ["gobletsq", "Goblet Squat (Kettlebell)", "Kettlebell", "Legs", "w", "squat", "Hold the weight at your chest, elbows inside your knees, sit down between your heels."],
    ["hack", "Hack Squat (Machine)", "Machine", "Legs", "w", "squat"],
    ["legpress", "Leg Press (Machine)", "Machine", "Legs", "w", "squat", "Feet hip-width on the platform, lower until your knees are at about 90°, press through your heels.", { m: { quads: 1, glutes: .5 }, r: [10, 12], rest: 120 }],
    ["rdl", "Romanian Deadlift (Barbell)", "Barbell", "Legs", "w", "rdl", "Hips back, bar close to your legs, slight bend in the knees."],
    ["dbrdl", "Romanian Deadlift (Dumbbell)", "Dumbbell", "Legs", "w", "rdl", "Dumbbells close to your legs, push your hips far back."],
    ["sldl", "Stiff-Leg Deadlift (Barbell)", "Barbell", "Legs", "w", "rdl"],
    ["sumo", "Sumo Deadlift (Barbell)", "Barbell", "Legs", "w", "hinge", "Wide stance, toes out, hands inside your knees, push your knees out as you stand."],
    ["goodmorning", "Good Morning (Barbell)", "Barbell", "Legs", "w", "rdl", "Bar on your upper back, soft knees, bow forward with a flat back."],
    ["bulgarian", "Bulgarian Split Squat (Dumbbell)", "Dumbbell", "Legs", "w", "lunge", "Back foot on the bench, lean slightly forward, push through your front heel. Reps per side."],
    ["lunge", "Lunge (Dumbbell)", "Dumbbell", "Legs", "w", "lunge"],
    ["walklunge", "Walking Lunge (Dumbbell)", "Dumbbell", "Legs", "w", "lunge", "Long steps forward, back knee close to the floor. Reps per side."],
    ["revlunge", "Reverse Lunge (Dumbbell)", "Dumbbell", "Legs", "w", "lunge", "Big step back, lean slightly forward, push up through your front heel."],
    ["stepup", "Step-up (Dumbbell)", "Dumbbell", "Legs", "w", "lunge", "Whole foot on the box, push up through that heel, step down slowly."],
    ["split", "Split Squat (Dumbbell)", "Dumbbell", "Legs", "w", "lunge", "Both feet on the floor, big step, lower straight down. Reps per side."],
    ["bwsplit", "Split Squat", "Bodyweight", "Legs", "r", "lunge"],
    ["pistol", "Pistol Squat", "Bodyweight", "Legs", "r", "squat", "Stand on one leg, other leg forward, sit down slowly. Hold on to something at first."],
    ["hip", "Hip Thrust (Barbell)", "Barbell", "Legs", "w", "thrust", "Upper back on the bench, chin to chest, hold for one second at the top."],
    ["smithhip", "Hip Thrust (Smith Machine)", "Smith Machine", "Legs", "w", "thrust", "Bar over your hips, chin to chest, hold for one second at the top."],
    ["glutebridge", "Hip Thrust (Machine)", "Machine", "Legs", "w", "thrust", "Feet hip-width apart, squeeze your glutes hard at the top."],
    ["dbhip", "Hip Thrust (Dumbbell)", "Dumbbell", "Legs", "w", "thrust", "Dumbbell on your hips, lower slowly, hold at the top."],
    ["bridge", "Glute Bridge", "Bodyweight", "Legs", "r", "thrust", "On your back, feet close to your hips, push your hips up and squeeze.", { r: [15, 20], rest: 45 }],
    ["kick", "Glute Kickback (Cable)", "Cable", "Legs", "w", "kick"],
    ["kickm", "Glute Kickback (Machine)", "Machine", "Legs", "w", "kick"],
    ["abd", "Hip Abduction (Machine)", "Machine", "Legs", "w", "abduct", "Lean your torso forward to target the upper glutes."],
    ["add", "Hip Adduction (Machine)", "Machine", "Legs", "w", "adduct"],
    ["cableadd", "Hip Adduction (Cable)", "Cable", "Legs", "w", "adduct", "Stand side-on to the cable, pull your leg across in front of your standing leg. Reps per side."],
    ["legext", "Leg Extension (Machine)", "Machine", "Legs", "w", "legext"],
    ["legcurl", "Lying Leg Curl (Machine)", "Machine", "Legs", "w", "legcurl"],
    ["seatcurl", "Seated Leg Curl (Machine)", "Machine", "Legs", "w", "legcurl", "Thigh pad tight, pull your heels down and back, return slowly."],
    ["nordic", "Nordic Curl", "Bodyweight", "Legs", "r", "legcurl", "Kneel with your heels anchored, lower your body forward as slowly as you can.", { r: [3, 6], rest: 120 }],
    ["hyper", "Hyperextension", "Bodyweight", "Legs", "w", "rdl", "Round your upper back slightly, move from your hips, squeeze your glutes. Added weight optional."],
    ["calf", "Standing Calf Raise (Machine)", "Machine", "Legs", "w", "calf"],
    ["seatcalf", "Seated Calf Raise (Machine)", "Machine", "Legs", "w", "calf"],
    ["dbcalf", "Calf Raise (Dumbbell)", "Dumbbell", "Legs", "w", "calf"],
    ["boxjump", "Box Jump", "Other", "Legs", "r", "plyo"],
    ["wallsit", "Wall Sit", "Bodyweight", "Legs", "t", "isoleg"],
    // Core
    ["plank", "Plank", "Bodyweight", "Core", "t", "hold", "Forearms under your shoulders, body in one line, squeeze your glutes."],
    ["sideplank", "Side Plank", "Bodyweight", "Core", "t", "hold", "Elbow under your shoulder, hips high. Time per side."],
    ["hollow", "Hollow Hold", "Bodyweight", "Core", "t", "hold", "Lower back pressed into the floor, arms and legs long and just off the ground."],
    ["climber", "Mountain Climber", "Bodyweight", "Core", "t", "hold", "Plank position, drive your knees to your chest in turn, hips low."],
    ["crunch", "Crunch", "Bodyweight", "Core", "r", "abs"],
    ["bicycle", "Bicycle Crunch", "Bodyweight", "Core", "r", "abs", "Elbow toward the opposite knee, slow and controlled. Reps per side."],
    ["declcrunch", "Decline Crunch", "Bodyweight", "Core", "r", "abs"],
    ["situp", "Sit-up", "Bodyweight", "Core", "r", "abs"],
    ["vup", "V-up", "Bodyweight", "Core", "r", "abs"],
    ["deadbug", "Dead Bug", "Bodyweight", "Core", "r", "abs", "Lower back flat, lower the opposite arm and leg slowly, switch sides."],
    ["hlr", "Hanging Leg Raise", "Bodyweight", "Core", "r", "abs", "Hang from the bar, raise straight legs to hip height without swinging."],
    ["hkr", "Hanging Knee Raise", "Bodyweight", "Core", "r", "abs", "Hang from the bar, pull your knees up to your chest, lower slowly."],
    ["llr", "Lying Leg Raise", "Bodyweight", "Core", "r", "abs", "Lower back flat, lower your legs only as far as you can keep it there."],
    ["abwheel", "Ab Wheel Rollout", "Other", "Core", "r", "abs", "From your knees, roll out with a flat back, pull back with your abs."],
    ["rtwist", "Russian Twist (Dumbbell)", "Dumbbell", "Core", "w", "rot"],
    ["cablecrunch", "Cable Crunch", "Cable", "Core", "w", "abs", "Kneel, rope by your head, crunch down by rounding your back."],
    ["pallof", "Pallof Press (Cable)", "Cable", "Core", "w", "rot", "Stand side-on to the cable, press the handle forward and resist the rotation. Reps per side."],
    ["woodchop", "Woodchopper (Cable)", "Cable", "Core", "w", "rot"],
    // Full body
    ["powerclean", "Power Clean (Barbell)", "Barbell", "Full body", "w", "olym"],
    ["clean", "Clean (Barbell)", "Barbell", "Full body", "w", "olym"],
    ["cleanjerk", "Clean and Jerk (Barbell)", "Barbell", "Full body", "w", "olym"],
    ["snatch", "Snatch (Barbell)", "Barbell", "Full body", "w", "olym"],
    ["thruster", "Thruster (Barbell)", "Barbell", "Full body", "w", "olym", "Front squat straight into an overhead press in one movement.", { r: [8, 10], rest: 90 }],
    ["kbswing", "Kettlebell Swing", "Kettlebell", "Full body", "w", "swing"],
    ["tgu", "Turkish Get-up", "Kettlebell", "Full body", "w", "carry", "Bell locked out overhead, stand up step by step, then reverse. Reps per side.", { r: [2, 4], rest: 90 }],
    ["burpee", "Burpee", "Bodyweight", "Full body", "r", "cond"],
    ["farmer", "Farmer's Walk (Dumbbell)", "Dumbbell", "Full body", "t", "carry"],
    ["wallball", "Wall Ball", "Other", "Full body", "r", "cond", "Squat with the ball at your chest, throw it to the target as you stand up."],
    ["sled", "Sled Push", "Other", "Full body", "t", "cond", "Arms long, lean in, push with short powerful steps.", { r: [20, 30] }],
    ["ropes", "Battle Ropes", "Other", "Full body", "t", "cond", "Soft knees, make waves with your arms, keep a steady rhythm.", { r: [20, 30] }],
    // Cardio (time in minutes)
    ["rowing", "Rowing (Machine)", "Machine", "Cardio", "t", "cardio", "Legs, then back, then arms. Reverse on the way back."],
    ["bike", "Assault Bike", "Machine", "Cardio", "t", "cardio"],
    ["cycling", "Cycling (Machine)", "Machine", "Cardio", "t", "cardio"],
    ["elliptical", "Elliptical", "Machine", "Cardio", "t", "cardio"],
    ["stairs", "Stair Climber", "Machine", "Cardio", "t", "cardio"],
    ["jumprope", "Jump Rope", "Other", "Cardio", "t", "cardio", "Small jumps on the balls of your feet, turn the rope from your wrists.", { r: [3, 5] }],
    // Kept only so older sessions still show a name; not offered in the library
    ["ohtri", "Overhead Triceps Extension (Dumbbell)", "Dumbbell", "Arms", "w", "tri", "", { hidden: true }]
  ];

  function fromRow(row) {
    const [id, n, eq, part, type, pat, cue, extra] = row, p = PATTERNS[pat];
    return Object.assign({ id, n, eq, part, type, pat, cue: cue || p.cue, m: p.m, s: p.s, r: p.r.slice(), rest: p.rest }, extra || {});
  }
  const LIBRARY = ROWS.map(fromRow);

  // Drawings of each exercise in app/img/ex/<id>-1.svg, <id>-2.svg … with a caption per frame.
  // Sources (both CC BY-SA 4.0, see app/img/ex/SOURCES.md): Everkinetic, and Workout Guide by Bryl Lim (WG).
  const DRAWINGS = {
    bench: ["Arms straight", "Bar to chest"], inclbb: ["Arms straight", "Bar to chest"], declbb: ["Arms straight", "Bar to chest"],
    flatdb: ["Arms straight", "Lower to chest"], incl: ["Arms straight", "Lower to chest"], dbfly: ["Arms up", "Open wide"],
    incfly: ["Arms up", "Open wide"], pullover: ["Over your chest", "Behind your head"], smithbench: ["Arms straight", "Bar to chest"],
    chestpress: ["Handles at chest", "Press"], crossover: ["Arms open", "Hands together"], pushup: ["Arms straight", "Chest down"],
    chestdip: ["Arms straight", "Lower"], deadlift: ["Set up", "Stand up"], tbar: ["Arms long", "Pull"],
    dbrow: ["Arm long", "Pull to hip"], crow: ["Arms long", "Pull"], latclose: ["Arms long", "Pull down"],
    straightarm: ["Arms up", "Sweep down"], pullup: ["Hang", "Pull up"], invrow: ["Arms long", "Chest to bar"],
    bbshrug: ["Arms long", "Shoulders up"], dbshrug: ["Arms long", "Shoulders up"], lra: ["Arms down", "Raise"],
    frontdb: ["Arms down", "Raise"], revflydb: ["Arms down", "Raise"], uprow: ["Arms long", "Pull up"],
    bbcurl: ["Arms long", "Curl"], bic: ["Arms long", "Curl"], cablecurl: ["Arms long", "Curl"],
    hammer: ["Arms long", "Curl"], inccurl: ["Arms long", "Curl"], conccurl: ["Arm long", "Curl"],
    preacher: ["Arms long", "Curl"], preacherm: ["Arms long", "Curl"], pushdown: ["Elbows bent", "Push down"],
    ropepd: ["Elbows bent", "Push down"], tri: ["Arms straight", "Lower behind head"], skull: ["Arms straight", "Lower to forehead"],
    cgbench: ["Arms straight", "Bar to chest"], tridip: ["Arms straight", "Lower"], benchdip: ["Arms straight", "Lower"],
    kickback: ["Elbow bent", "Extend"], squat: ["Stand tall", "Sit down"], smithsq: ["Stand tall", "Sit down"],
    frontsq: ["Stand tall", "Sit down"], hack: ["Legs straight", "Lower"], legpress: ["Legs straight", "Lower"],
    rdl: ["Stand tall", "Hips back"], dbrdl: ["Stand tall", "Hips back"], goodmorning: ["Stand tall", "Bow forward"],
    lunge: ["Stand tall", "Step and lower"], walklunge: ["Stand tall", "Step and lower"], revlunge: ["Stand tall", "Step back and lower"],
    stepup: ["Foot on the box", "Step up"], bridge: ["Hips down", "Hips up"], kick: ["Stand tall", "Kick back"],
    abd: ["Knees together", "Push out"], add: ["Legs open", "Squeeze together"], cableadd: ["Leg out", "Pull across"],
    legext: ["Knees bent", "Extend"], legcurl: ["Legs long", "Curl"], seatcurl: ["Legs long", "Curl"],
    hyper: ["Bend down", "Lift up"], calf: ["Heels down", "Rise up"], seatcalf: ["Heels down", "Rise up"],
    sideplank: ["Set up", "Hips up and hold"], crunch: ["Lie back", "Crunch up"], bicycle: ["Start", "Elbow to knee"],
    declcrunch: ["Lie back", "Crunch up"], llr: ["Legs down", "Legs up"], abwheel: ["On your knees", "Roll out"],
    // Workout Guide (Bryl Lim), recoloured from white to black
    pecdeck: ["Arms open", "Bring together"], incpushup: ["Arms straight", "Chest to the box"], bbrow: ["Arms long", "Pull to belly"],
    pendlay: ["Bar on the floor", "Pull to chest"], rackpull: ["Bar at the knees", "Stand up"], csrow: ["Arms long", "Pull"],
    mrow: ["Arms long", "Pull"], lat: ["Arms long", "Pull to chest"], chinup: ["Hang", "Pull up"],
    apullup: ["Hang", "Pull up"], ohp: ["Bar at shoulders", "Press up"], pushpress: ["Dip the knees", "Drive up"],
    landmine: ["Bar at shoulder", "Press"], dbsp: ["At shoulder height", "Press up"], arnold: ["Palms to you", "Rotate and press"],
    msp: ["Handles at shoulders", "Press up"], lracable: ["Arms down", "Raise"], lram: ["Arms down", "Raise"],
    frontplate: ["Plate down", "Raise"], revflym: ["Arms in front", "Open wide"], facepull: ["Arms long", "Pull to face"],
    revcurl: ["Arms long", "Curl"], ohcable: ["Elbows bent", "Extend"], gobletsq: ["Stand tall", "Sit down"],
    sumo: ["Set up", "Stand up"], bulgarian: ["Stand tall", "Lower"], split: ["Stand tall", "Lower"],
    pistol: ["Stand on one leg", "Sit down"], hip: ["Hips down", "Drive up"], smithhip: ["Hips down", "Drive up"],
    dbhip: ["Hips down", "Drive up"], nordic: ["Kneel tall", "Lower slowly"], wallsit: ["Back on the wall", "Sit and hold"],
    plank: ["Body in one line"], hollow: ["Lower back down, hold"], climber: ["Plank", "Knee to chest"],
    vup: ["Lie long", "Fold up"], deadbug: ["Arms and knees up", "Extend opposite arm and leg"], hlr: ["Hang", "Raise your legs"],
    hkr: ["Hang", "Knees up"], rtwist: ["Turn to one side", "Turn to the other"], pallof: ["Handle at chest", "Press out"],
    kbswing: ["Hinge", "Swing up"], burpee: ["Squat down", "Jump back to plank", "Jump up"], farmer: ["Stand tall", "Walk"],
    ropes: ["Make waves"], rowing: ["Catch", "Finish"], bike: ["Push and pull"],
    cycling: ["Pedal"], elliptical: ["Stride"], stairs: ["Climb"],
    jumprope: ["Small jumps"]
  };
  const DRAWING_WG = new Set(["pecdeck", "incpushup", "bbrow", "pendlay", "rackpull", "csrow", "mrow", "lat", "chinup", "apullup", "ohp", "pushpress", "landmine", "dbsp", "arnold", "msp", "lracable", "lram", "frontplate", "revflym", "facepull", "revcurl", "ohcable", "gobletsq", "sumo", "bulgarian", "split", "pistol", "hip", "smithhip", "dbhip", "nordic", "wallsit", "plank", "hollow", "climber", "vup", "deadbug", "hlr", "hkr", "rtwist", "pallof", "kbswing", "burpee", "farmer", "ropes", "rowing", "bike", "cycling", "elliptical", "stairs", "jumprope"]);
  // Exercises without a drawing were taken out of the library in v2.8.2. They stay hidden here
  // (like ohtri) so older sessions keep their names and progress curves.
  const RETIRED = ["inclm", "lowfly", "latone", "bayes", "sldl", "glutebridge", "dbcalf", "boxjump", "situp", "woodchop",
    "powerclean", "clean", "cleanjerk", "snatch", "thruster", "tgu", "wallball", "sled", "atridip", "bwsplit", "kickm", "cablecrunch"];
  LIBRARY.forEach(e => { if (RETIRED.includes(e.id)) e.hidden = true; });
  LIBRARY.forEach(e => { if (DRAWINGS[e.id]) { e.img = DRAWINGS[e.id].slice(); e.imgSrc = DRAWING_WG.has(e.id) ? "wg" : "ek"; } });
  const BY_ID = {};
  LIBRARY.forEach(e => { BY_ID[e.id] = e; });

  // Time is logged in seconds, cardio machines in minutes
  const unitOf = ex => ex.type === "t" ? (ex.part === "Cardio" ? "min" : "s") : ex.type === "r" ? "reps" : "kg";

  // Text search over name, equipment and body part plus optional filters. Custom exercises can be passed in.
  function norm(s) { return String(s || "").toLowerCase().replace(/[-()']/g, " ").replace(/\s+/g, " ").trim(); }
  function search(query, opts) {
    const o = opts || {}, words = norm(query).split(" ").filter(Boolean);
    const list = LIBRARY.filter(e => !e.hidden).concat(o.custom || []);
    return list.filter(e => (!o.part || e.part === o.part) && (!o.eq || e.eq === o.eq) &&
      words.every(w => norm(e.n + " " + e.eq + " " + e.part).includes(w)))
      .sort((a, b) => {
        const s = x => (words.length && norm(x.n).startsWith(words.join(" ")) ? 0 : 1);
        return s(a) - s(b) || a.n.localeCompare(b.n);
      });
  }

  // Exercises that can replace another one: same movement pattern, the original's type first
  function alternatives(id, custom) {
    const ex = BY_ID[id] || (custom || []).find(c => c.id === id);
    if (!ex) return [];
    return LIBRARY.filter(e => !e.hidden && e.id !== id && e.pat === ex.pat).concat((custom || []).filter(c => c.id !== id && c.pat && c.pat === ex.pat))
      .sort((a, b) => (a.type !== ex.type) - (b.type !== ex.type));
  }

  /* ---------- Custom exercises ---------- */
  // Body part → movement pattern used for muscles, defaults and alternatives
  const PART_PAT = { Chest: "hpress", Back: "hrow", Shoulders: "raise", Arms: "curl", Legs: "squat", Core: "abs", "Full body": "cond", Cardio: "cardio" };
  const customName = (name, eq) => (eq === "Bodyweight" || eq === "Other" ? name : `${name} (${eq})`);

  function validateCustom(input, existing) {
    const name = String((input && input.name) || "").trim().replace(/\s+/g, " ");
    const eq = (input && input.eq) || "", part = (input && input.part) || "", type = (input && input.type) || "";
    const errors = {};
    if (!name) errors.name = "Enter a name";
    else if (name.length < 3) errors.name = "Use at least 3 characters";
    else if (name.length > 40) errors.name = "Use 40 characters or fewer";
    else if (/[<>{}"`]/.test(name)) errors.name = "Use letters, numbers and simple punctuation only";
    if (!PARTS.includes(part)) errors.part = "Choose a body part";
    if (!EQUIP.includes(eq)) errors.eq = "Choose the equipment";
    if (!TYPES[type]) errors.type = "Choose how you log it";
    if (!errors.name && !errors.eq) {
      const full = norm(customName(name, eq));
      const taken = LIBRARY.filter(e => !e.hidden).concat(existing || []).some(e => norm(e.n) === full);
      if (taken) errors.name = "This exercise already exists. Search for it in the library.";
    }
    const ok = Object.keys(errors).length === 0;
    return { ok, errors, value: ok ? { n: customName(name, eq), eq, part, type } : null };
  }

  /* Cleans user text that comes back from storage, a backup file or the cloud sync:
     no markup characters, single spaces, at most `max` characters. Empty → fallback. */
  function safeText(v, max, fallback) {
    const t = String(v == null ? "" : v).replace(/[<>{}"`]/g, "").replace(/\s+/g, " ").trim().slice(0, max || 60);
    return t || (fallback || "");
  }
  /* Custom exercises from storage or a backup: keep only well-formed ones, with a clean name.
     The form checks new exercises (validateCustom); this protects against edited or broken files. */
  function safeCustom(list) {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter(c => c && typeof c === "object" && /^[A-Za-z0-9_-]{1,40}$/.test(String(c.id)) && !seen.has(c.id) && seen.add(c.id) && !BY_ID[c.id] && TYPES[c.type])
      .map(c => Object.assign({}, c, { n: safeText(c.n, 60, "Own exercise"), eq: safeText(c.eq, 20), part: safeText(c.part, 20), cue: safeText(c.cue, 200) }));
  }

  // Builds the stored custom exercise. `id` must be unique, e.g. "c" + a timestamp.
  function makeCustom(value, id) {
    const pat = PART_PAT[value.part] || "cond", p = PATTERNS[pat];
    const t = value.type, r = t === "t" ? (value.part === "Cardio" ? [10, 20] : [30, 45]) : p.r.slice();
    return { id, n: value.n, eq: value.eq, part: value.part, type: t, pat, custom: true, cue: "", m: p.m, s: 3, r, rest: p.rest };
  }

  /* ---------- Workout templates ---------- */
  // group decides warm-up and the mobility add-on. Each exercise: [id, sets, min reps, max reps, rest, optional]
  // For time exercises the "reps" are seconds (minutes for cardio).
  const TEMPLATES = {
    po: { name: "Lower Body", group: "lower", ex: [["squat", 3, 8, 10, 150], ["rdl", 3, 10, 12, 120], ["bulgarian", 3, 10, 12, 90], ["hip", 3, 10, 12, 120], ["calf", 3, 12, 15, 60],
      ["legcurl", 2, 10, 12, 60, 1], ["legext", 2, 12, 15, 60, 1], ["add", 2, 12, 15, 60, 1]] },
    loB: { name: "Lower Body B", group: "lower", ex: [["hip", 4, 8, 12, 120], ["legpress", 3, 10, 12, 120], ["dbrdl", 3, 10, 12, 90], ["walklunge", 3, 10, 12, 90], ["abd", 3, 12, 15, 60], ["legcurl", 3, 10, 12, 60],
      ["kick", 2, 12, 15, 60, 1], ["seatcalf", 2, 12, 15, 60, 1]] },
    oben: { name: "Upper Body", group: "upper", ex: [["bench", 3, 6, 10, 150], ["lat", 3, 8, 12, 90], ["dbsp", 3, 8, 12, 90], ["crow", 3, 10, 12, 90], ["lra", 3, 12, 15, 60], ["bic", 2, 10, 12, 60],
      ["pushdown", 2, 10, 15, 60, 1], ["facepull", 2, 12, 15, 60, 1]] },
    upB: { name: "Upper Body B", group: "upper", ex: [["incl", 3, 8, 12, 90], ["apullup", 3, 6, 10, 120], ["arnold", 3, 8, 12, 90], ["csrow", 3, 10, 12, 90], ["pushdown", 3, 10, 12, 60], ["hammer", 3, 10, 12, 60],
      ["lracable", 2, 12, 15, 60, 1], ["revflym", 2, 12, 15, 60, 1]] },
    fbA: { name: "Full Body A", group: "full", ex: [["squat", 3, 6, 10, 150], ["flatdb", 3, 8, 12, 90], ["crow", 3, 10, 12, 90], ["dbrdl", 3, 10, 12, 90], ["dbsp", 2, 8, 12, 90], ["plank", 3, 30, 45, 45],
      ["lra", 2, 12, 15, 60, 1], ["bic", 2, 10, 12, 60, 1]] },
    fbB: { name: "Full Body B", group: "full", ex: [["legpress", 3, 10, 12, 120], ["incl", 3, 8, 12, 90], ["lat", 3, 8, 12, 90], ["hip", 3, 8, 12, 120], ["lra", 3, 12, 15, 60], ["deadbug", 3, 10, 12, 45],
      ["hammer", 2, 10, 12, 60, 1], ["pushdown", 2, 10, 15, 60, 1]] },
    fbC: { name: "Full Body C", group: "full", ex: [["gobletsq", 3, 10, 12, 90], ["pushup", 3, 8, 15, 60], ["dbrow", 3, 10, 12, 90], ["bulgarian", 3, 10, 12, 90], ["facepull", 3, 12, 15, 60], ["hkr", 3, 10, 12, 60],
      ["kbswing", 2, 12, 15, 60, 1], ["farmer", 2, 30, 45, 60, 1]] },
    push: { name: "Push", group: "push", ex: [["bench", 3, 6, 10, 150], ["incl", 3, 8, 12, 90], ["dbsp", 3, 8, 12, 90], ["lra", 3, 12, 15, 60], ["pushdown", 3, 10, 12, 60],
      ["crossover", 2, 12, 15, 60, 1], ["ohcable", 2, 10, 12, 60, 1]] },
    pull: { name: "Pull", group: "pull", ex: [["lat", 3, 8, 12, 90], ["bbrow", 3, 8, 10, 120], ["crow", 3, 10, 12, 90], ["facepull", 3, 12, 15, 60], ["bbcurl", 3, 10, 12, 60],
      ["hammer", 2, 10, 12, 60, 1], ["hkr", 2, 10, 12, 60, 1]] },
    legs: { name: "Legs", group: "legs", ex: [["squat", 3, 6, 10, 150], ["legpress", 3, 10, 12, 120], ["rdl", 3, 8, 10, 120], ["legcurl", 3, 10, 12, 60], ["calf", 3, 12, 15, 60],
      ["legext", 2, 12, 15, 60, 1], ["llr", 2, 10, 15, 45, 1]] },
    empty: { name: "Empty Workout", group: "free", ex: [] }
  };
  const TEMPLATE_ORDER = ["fbA", "fbB", "fbC", "oben", "upB", "po", "loB", "push", "pull", "legs", "empty"];

  // Turns a template into the exercise list a session uses
  function templateExercises(key) {
    const t = TEMPLATES[key];
    if (!t) return [];
    return t.ex.map(([id, s, lo, hi, rest, opt]) => Object.assign({}, BY_ID[id], { s, r: [lo, hi], rest, opt: !!opt }));
  }

  // Muscles an exercise trains most, for the "how to" sheet
  const MUSCLE_NAMES = { glutes: "Glutes", hams: "Hamstrings", quads: "Quads", adduct: "Inner thighs", calves: "Calves", back: "Back", lowback: "Lower back", chest: "Chest", shoulders: "Shoulders", biceps: "Biceps", triceps: "Triceps", core: "Core" };
  function focusOf(ex) {
    if (!ex || !ex.m) return "";
    return Object.entries(ex.m).filter(([, w]) => w >= .5).sort((a, b) => b[1] - a[1]).map(([k]) => MUSCLE_NAMES[k]).join(", ");
  }

  const api = { safeText, safeCustom, RETIRED, TYPES, PARTS, EQUIP, PATTERNS, LIBRARY, BY_ID, DRAWINGS, TEMPLATES, TEMPLATE_ORDER, MUSCLE_NAMES,
    unitOf, search, alternatives, validateCustom, makeCustom, templateExercises, focusOf };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.NFEx = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
