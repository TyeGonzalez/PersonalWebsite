// scroll to top functionality
// assign variable to html element with id of scroll-up
const scrollUp = document.querySelector("#scroll-up");

// add event listener to scrollUp variable
// on click event, window.scrollTo(0, 0)
scrollUp.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});


const mu = 1.25663706 * 10**(-6) /* value of mu */;
const hbar = 1.0545718e-34 /* value of hbar */;
const gamma = 42.58 * 10**6 /* value of gamma */;
const spectrometer_MHZ=700
const larmor_freq=2*Math.PI*spectrometer_MHZ*10**6



// Nav hamburgerburger selections

const burger = document.querySelector("#burger-menu");
const ul = document.querySelector("nav ul");
const nav = document.querySelector("nav");


burger.addEventListener("click", () => {
    ul.classList.toggle("show");
  });


// Close hamburger menu when a link is clicked

// Select nav links
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((link) =>
  link.addEventListener("click", () => {
    ul.classList.remove("show");
  })
);


function spectralDensity(omega, tau_c, S2) {
    return (2 / 5) * (1 - S2) * (tau_c / (1 + (omega ** 2) * (tau_c ** 2)));
}

function R1rhoH(beta_e, omega_r, omega_e, d_II2, omega_H, S2, tau_c) {
    const sin2BetaESquared = Math.sin(2 * beta_e) ** 2;
    const sinBetaEFourth = Math.sin(beta_e) ** 4;
    const cos2BetaE = Math.cos(2 * beta_e);

    const J_omega_r_omega_e = spectralDensity(omega_r - omega_e, tau_c, S2) + spectralDensity(omega_r + omega_e, tau_c, S2);
    const J_omega_r_2omega_e = spectralDensity(omega_r - 2 * omega_e, tau_c, S2) + spectralDensity(omega_r + 2 * omega_e, tau_c, S2);

    const J_omega_H = spectralDensity(omega_H, tau_c, S2);
    const J_2omega_H = spectralDensity(2 * omega_H, tau_c, S2);

    return (1 / 4) * d_II2 * (
        (3 / 4) * sinBetaEFourth * (J_omega_r_2omega_e) +
        (3 / 8) * sin2BetaESquared * (J_omega_r_omega_e) +
        (3 / 4) * (5 - cos2BetaE) * J_omega_H +
        (3 / 2) * (3 + cos2BetaE) * J_2omega_H
    );
}

function mu_1rhoAB(d_II2, beta_e, omega_r, omega_e, omega_I, S2, tau_c) {
  function spectralDensity(omega) {
      return (2 / 5) * (1 - S2) * (tau_c / (1 + (omega ** 2) * (tau_c ** 2)));
  }

  const cosBetaE = Math.cos(beta_e);
  const sinBetaE = Math.sin(beta_e);
  const mu_1rho = (1 / 192) * d_II2 * (
      144 * cosBetaE ** 2 * (spectralDensity(-2 * omega_I) + spectralDensity(2 * omega_I))
      - (1 / 2) * (1 + 3 * Math.cos(2 * beta_e)) ** 2 * (
          2 * spectralDensity(-1 * omega_r) + 2 * spectralDensity(1 * omega_r) + spectralDensity(-2 * omega_r) + spectralDensity(2 * omega_r)
      ) +
      72 * (spectralDensity(-1 * omega_I) + spectralDensity(1 * omega_I)) * sinBetaE ** 2 +
      9 * (
          2 * spectralDensity(-2 * omega_e - 1 * omega_r) + 2 * spectralDensity(2 * omega_e - 1 * omega_r) +
          2 * spectralDensity(-2 * omega_e + 1 * omega_r) + 2 * spectralDensity(2 * omega_e + 1 * omega_r) +
          spectralDensity(2 * omega_e - 2 * omega_r) + spectralDensity(-2 * omega_e + 2 * omega_r) +
          spectralDensity(-2 * (omega_e + omega_r)) + spectralDensity(2 * (omega_e + omega_r))
      ) * sinBetaE ** 4
  );

  return Math.abs(mu_1rho);
}


function updatePlot() {
  updateAutoPlot();
  updateCrossPlot();
}

function updateAutoPlot() {
    // const vmin = parseFloat(document.getElementById('vmin_slider').value);
    // const vmax = parseFloat(document.getElementById('vmax_slider').value);
    const xmax = parseFloat(document.getElementById('xmax_slider').value);
    var tau_c = parseFloat(document.getElementById('tau_c_slider').value);
    const S2i = parseFloat(document.getElementById('S2i_slider').value);
    const r_eff = parseFloat(document.getElementById('r_eff_slider').value);
    const spin_freq = parseFloat(document.getElementById('spin_freq_slider').value);
    const mu = 1.25663706 * 10**(-6) /* value of mu */;
    const hbar = 1.0545718e-34 /* value of hbar */;
    const gamma = 42.58 * 10**6 /* value of gamma */;
    const spectrometer_MHZ=700
    const larmor_freq=2*Math.PI*spectrometer_MHZ*10**6
    function d_II2(r) {
      var d_II = -1 * (mu / (4 * Math.PI)) * hbar * (gamma ** 2) * (1 / (r ** 3));
      return d_II ** 2;
    }
    
    document.getElementById('xmax_value').textContent = xmax;
    document.getElementById('tau_c_value').textContent = tau_c;
    document.getElementById('S2i_value').textContent = S2i;
    document.getElementById('r_eff_value').textContent = r_eff;
    document.getElementById('spin_freq_value').textContent = spin_freq;




    const omega_e_array = Array.from({length: 1250}, (_, i) => i * xmax * 1000 * 2 * Math.PI / 1249 );
    const beta_e_values = Array.from({length: 1000}, (_, i) => i * Math.PI / 990);

    const data = {
        z: [],
        x: omega_e_array.map(omega => omega / (2 * Math.PI * 1000)), // convert rad/s to kHz for the plot
        y: beta_e_values.map(beta => beta * 180 / Math.PI), // convert radians to degrees for the plot
        type: 'heatmap',
        colorscale: 'Inferno'
    };
    const tau_c_inp = 10**(tau_c);

    for (let beta_e of beta_e_values) {
        let zRow = [];
        for (let omega_e of omega_e_array) {
            let r1rho = R1rhoH(beta_e, spin_freq *(1000 * 2 * Math.PI), omega_e , larmor_freq,d_II2(r_eff*10**(-10)) , S2i, tau_c_inp);
            zRow.push(r1rho);
        }
        data.z.push(zRow);
    }

    const layout = {
        title: 'Heatmap of R1ρH Across ωe and βe',
        xaxis: { title: 'ωe / 2π (kHz)' },
        yaxis: { title: 'βe (degrees)' },
        autosize: true
    };

    Plotly.newPlot('Autorelaxationplot', [data], layout);
}

// Initial plot
updateAutoPlot();


function updateCrossPlot() {
  // const vmin = parseFloat(document.getElementById('vmin_slider').value);
  // const vmax = parseFloat(document.getElementById('vmax_slider').value);
  const xmax = parseFloat(document.getElementById('xmax_slider').value);
  var tau_c = parseFloat(document.getElementById('tau_c_slider').value);
  const S2i = parseFloat(document.getElementById('S2i_slider').value);
  const r_eff = parseFloat(document.getElementById('r_eff_slider').value);
  const spin_freq = parseFloat(document.getElementById('spin_freq_slider').value);
  const mu = 1.25663706 * 10**(-6) /* value of mu */;
  const hbar = 1.0545718e-34 /* value of hbar */;
  const gamma = 42.58 * 10**6 /* value of gamma */;
  const spectrometer_MHZ=700
  const larmor_freq=2*Math.PI*spectrometer_MHZ*10**6
  const tau_c_inp = 10**(tau_c);

  function d_II2(r) {
    var d_II = -1 * (mu / (4 * Math.PI)) * hbar * (gamma ** 2) * (1 / (r ** 3));
    return d_II ** 2;
  }

  document.getElementById('xmax_value').textContent = xmax;
  document.getElementById('tau_c_value').textContent = tau_c;
  document.getElementById('S2i_value').textContent = S2i;
  document.getElementById('r_eff_value').textContent = r_eff;
  document.getElementById('spin_freq_value').textContent = spin_freq;




  const omega_e_array = Array.from({length: 1250}, (_, i) => i * xmax * 1000 * 2 * Math.PI / 1249 );
  const beta_e_values = Array.from({length: 1000}, (_, i) => i * Math.PI / 990);

  const data = {
      z: [],
      x: omega_e_array.map(omega => omega / (2 * Math.PI * 1000)), // convert rad/s to kHz for the plot
      y: beta_e_values.map(beta => beta * 180 / Math.PI), // convert radians to degrees for the plot
      type: 'heatmap',
      colorscale: 'Inferno'
  };

  for (let beta_e of beta_e_values) {
      let zRow = [];
      for (let omega_e of omega_e_array) {
          let mu1rho = mu_1rhoAB(d_II2(r_eff*10**(-10)), beta_e, spin_freq *(1000 * 2 * Math.PI), omega_e, larmor_freq, S2i, tau_c_inp);
          zRow.push(mu1rho);
      }
      data.z.push(zRow);
  }

  const layout = {
      title: 'Heatmap of MuρH Across ωe and βe',
      xaxis: { title: 'ωe / 2π (kHz)' },
      yaxis: { title: 'βe (degrees)' },
      autosize: true
  };

  Plotly.newPlot('Crossrelaxationplot', [data], layout);
}

// Initial plot
updateCrossPlot();