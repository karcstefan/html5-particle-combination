window.onload = function () {

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  document.addEventListener("click", addPoints);
  var canvas = document.getElementById("main"),
      ctx = canvas.getContext("2d")
      particles = {},
      particleIndex = 0,
      range = 100,
      forceSpring = 1000,
      particleNumber = 30,
      counter = 0,
      pause = 0,
      sizeToExplode = 0,
      particleMaxSize = 200;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


  var Particle = function(a, b) {
    this.id = particleIndex;

    if(a == 0)
    {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }
    else
    {
      this.x = a;
      this.y = b;
    }

    this.vx = Math.random()  - 0.5;
    this.vy = Math.random()  - 0.5;
    this.size = Math.random() * 10 + 4;
    this.sizeToReach = 0;
    this.growing = false;
    particles[particleIndex] = this;
    particleIndex++;
  }

  Particle.prototype.draw = function(){
    this.x += this.vx;
    this.y += this.vy;

    if(this.x <= 0 + this.size )
    {
      this.x = this.size;
      this.vx *= -1;
    }

    if(this.x + this.size >= canvas.width - 1)
    {
      this.x = canvas.width - this.size - 1;
      this.vx *= -1;
    }

    if(this.y <= 0 + this.size)
    {
      this.y = this.size;
      this.vy *= -1;
    }

    if(this.y + this.size >= canvas.height - 1)
    {
      this.y = canvas.height - this.size - 1;
      this.vy *= -1;
    }

    for(var i in particles)
    {
      if(this.id != particles[i].id)
      {
          var a = particles[i].x - this.x,
              b = particles[i].y - this.y,
              distance = Math.sqrt(a*a + b*b);

          if(distance <= range + this.size)
          {
            if(pause == 0)
            {
              this.vx += a * (1 / forceSpring) / this.size;
              this.vy += b * (1 / forceSpring) / this.size;
              particles[i].vx -= a * ( 1 / forceSpring) / particles[i].size;
              particles[i].vy -= b * ( 1 / forceSpring) / particles[i].size;
            }

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.strokeStyle = "rgba(0, 255, 255, 0.7)";
            ctx.stroke();
            ctx.closePath();
          }

          if(distance <= this.size + particles[i].size && pause == 0)
          {
            if(this.size > particles[i].size)
            {
              this.growing = true;
              this.sizeToReach += (this.size + particles[i].size)*0.9;

              delete particles[i];
            }
          }
      }
    }

    if(this.growing)
    {
      if(this.size < 200)
      {
        this.size += 0.5;
        if(this.sizeToReach < this.size)
        {
          this.growing = false;
          this.sizeToReach = 0;
        }
      }
    }

    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 255, 255, 0.7)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
    ctx.fill();
    //ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    //ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  for(var i = 0; i < particleNumber; i++)
    var p = new Particle(0, 0);

    function addPoints(e)
    {
        new Particle(e.clientX, e.clientY);
        particleNumber++;
    }

  setInterval(function(){

    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(var i in particles)
      particles[i].draw();

    if(Object.size(particles) == 1)
    {

      var tempX, tempY;
      for(var j in particles)
      {
        particles[j].size -= 5;

        if(particles[j].size < 5)
        {
          sizeToExplode = 1;
          tempX = particles[j].x;
          tempY = particles[j].y;

          delete particles[j];
        }
      }

      if(sizeToExplode == 1)
      {
        pause = counter;

        for(var i = 0; i < particleNumber; i++)
        {
          p = new Particle(tempX, tempY);
        }
        sizeToExplode = 0;
      }
    }

    if(counter - pause > 60 * 6)
    {
      pause = 0;
    }
    document.getElementById("particle-counter").textContent = particleNumber;
    counter++;
  }, 1000/60);

}
