import { Car } from './car.js'
import { Goal } from './goal.js'
import contactListener from './contactListener.js'
import draw from './draw.js'

function init() {
  var   b2Vec2 = Box2D.Common.Math.b2Vec2
     ,  b2AABB = Box2D.Collision.b2AABB
      ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
      ,	b2Body = Box2D.Dynamics.b2Body
      ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
      ,	b2Fixture = Box2D.Dynamics.b2Fixture
      ,	b2World = Box2D.Dynamics.b2World
      ,	b2MassData = Box2D.Collision.Shapes.b2MassData
      ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
      ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
      ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
     ,  b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
     ;
  
  var world = new b2World(
        new b2Vec2(0, 0)    //gravity
     ,  true                 //allow sleep
  );

  var worldDrawScale = 30.0
  
  var fixDef = new b2FixtureDef;
  fixDef.density = 1.0;
  fixDef.friction = 1.0;
  fixDef.restitution = 0.1;
  
  var bodyDef = new b2BodyDef;
  
  //create ground
  bodyDef.type = b2Body.b2_staticBody;
  fixDef.shape = new b2PolygonShape;
  fixDef.shape.SetAsBox(40, 2);
  bodyDef.position.Set(10, 720 / worldDrawScale + 1.8);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(10, -1.8);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  fixDef.shape.SetAsBox(2, 14);
  bodyDef.position.Set(-1.8, 13);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  bodyDef.position.Set(1280 / worldDrawScale + 1.8, 13);
  world.CreateBody(bodyDef).CreateFixture(fixDef);
  
  
  
  //create some objects
//   bodyDef.type = b2Body.b2_kinematicBody;
//   for(var i = 0; i < 10; ++i) {
//      if(Math.random() > 0.5) {
//         fixDef.shape = new b2PolygonShape;
//         fixDef.shape.SetAsBox(
//               Math.random() + 0.1 //half width
//            ,  Math.random() + 0.1 //half height
//         );
//      } else {
//         fixDef.shape = new b2CircleShape(
//            Math.random() + 0.1 //radius
//         );
//      }
//      bodyDef.position.x = Math.random() * 10;
//      bodyDef.position.y = Math.random() * 10;
//      world.CreateBody(bodyDef).CreateFixture(fixDef);
//   }
  
  
  //create some objects

    world.SetContactListener(contactListener.default)

  //setup debug draw
    var debugDraw = new b2DebugDraw();

    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    debugDraw.SetSprite(ctx);
    debugDraw.SetDrawScale(worldDrawScale);
    debugDraw.SetFillAlpha(0.5);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_controllerBit);
    world.SetDebugDraw(debugDraw);

    let goals = [new Goal(world, 'goal 1', 10, 10), new Goal(world, 'goal 2', 20, 20), new Goal(world, 'goal 3', 30, 20)]
    // let goals = [new Goal(world, 'goal 1', 15, 15)]
    draw.default.createDraw(ctx, worldDrawScale)

    let car = new Car(world, 5, 5, 2, draw)
    // car.default.createCar(world, 20, 10, 2, draw)

    document.addEventListener('keydown', (event) => {
        let code = event.key;
        car.control(code, true)
    });
    document.addEventListener('keyup', (event) => {
        let code = event.key;
        car.control(code, false)
    });

  window.setInterval(update, 1000 / 60);
  
  //update  
  function update() {

    let contact = contactListener.default.getBeginContact()

    if(contact) {
      console.log('fixA', contact.m_fixtureA.GetUserData(), 'fixB', contact.m_fixtureB.GetUserData())
      if ((contact.m_fixtureA.GetUserData() && contact.m_fixtureA.GetUserData().indexOf('goal') != -1 && (contact.m_fixtureB.GetUserData() == 'car' || contact.m_fixtureB.GetUserData() == 'wheel')) || ((contact.m_fixtureA.GetUserData() == 'car' || contact.m_fixtureA.GetUserData() == 'wheel') &&  contact.m_fixtureB.GetUserData() && contact.m_fixtureB.GetUserData().indexOf('goal') != -1)) {
        let remainingGoals = []
        goals.forEach((goal) => {
          if(contact.m_fixtureA.GetUserData() == goal.fixture.GetUserData() || contact.m_fixtureB.GetUserData() == goal.fixture.GetUserData())
          {
            world.DestroyBody(goal.body)
          } else {
            remainingGoals.push(goal)
          }
        })
        goals = remainingGoals
      }
    }

    let backwardOrForward = -1, leftOrRight = 1

    car.update(goals, backwardOrForward, leftOrRight)

    world.Step(1 / 60, 10, 10);
    world.DrawDebugData();
    world.ClearForces();

    // console.log('************************************')

    car.draw()
  };


};


      
init();