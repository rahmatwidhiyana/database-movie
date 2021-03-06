// AJAX Library
// $('.search-button').on('click', function () {
//   $.ajax({
//     url:
//       'http://www.omdbapi.com/?=&apikey=2d72c9e4&s=' +
//       $('.input-keyword').val(),
//     success: (results) => {
//       const movies = results.Search;
//       let cards = '';
//       movies.forEach((m) => {
//         cards += showCards(m);
//       });
//       $('.movie-container').html(cards);
//       $('.modal-detail-button').on('click', function () {
//         $.ajax({
//           url:
//             'http://www.omdbapi.com/?=&apikey=2d72c9e4&i=' +
//             $(this).data('imdbid'),
//           success: (m) => {
//             const movieDetail = showMovieDetail(m);
//             $('.modal-body').html(movieDetail);
//           },
//           error: (e) => {
//             console.log(e.responseText);
//           },
//         });
//       });
//     },
//     error: (e) => {
//       console.log(e.responseText);
//     },
//   });
// });

// ======================================================

// FETCH
// const searchButton = document.querySelector('.search-button');
// searchButton.addEventListener('click', function () {
//   const inputKeyword = document.querySelector('.input-keyword');
//   fetch('https://www.omdbapi.com/?=&apikey=2d72c9e4&s=' + inputKeyword.value)
//     .then((response) => response.json())
//     .then((response) => {
//       const movies = response.Search;
//       let cards = '';
//       movies.forEach((m) => (cards += showCards(m)));
//       const movieContainer = document.querySelector('.movie-container');
//       movieContainer.innerHTML = cards;

//       // ketika tombol detail di klik
//       const modalDetailButton = document.querySelectorAll(
//         '.modal-detail-button'
//       );
//       modalDetailButton.forEach((btn) => {
//         btn.addEventListener('click', function () {
//           const imdbid = this.dataset.imdbid;
//           fetch('https://www.omdbapi.com/?=&apikey=2d72c9e4&i=' + imdbid)
//             .then((response) => response.json())
//             .then((m) => {
//               const movieDetail = showMovieDetail(m);
//               const modalBody = document.querySelector('.modal-body');
//               modalBody.innerHTML = movieDetail;
//             });
//         });
//       });
//     });
// });

// ===============================================================================

// FETCH REFACTOR (async await)

const searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', async function () {
  try {
    const inputKeyword = document.querySelector('.input-keyword');
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (error) {
    // console.log(error);
    alert(error);
  }
});

function getMovies(keyword) {
  return fetch('https://www.omdbapi.com/?=&apikey=2d72c9e4&s=' + keyword)
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error('API Key not valid');
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === 'False') {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = '';
  movies.forEach((m) => (cards += showCards(m)));
  const movieContainer = document.querySelector('.movie-container');
  movieContainer.innerHTML = cards;
}

// event binding(click detail button)
document.addEventListener('click', async function (e) {
  if (e.target.classList.contains('modal-detail-button')) {
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetail(imdbid);
    updateUIDetails(movieDetail);
  }
});

function getMovieDetail(imdbid) {
  return fetch('https://www.omdbapi.com/?=&apikey=2d72c9e4&i=' + imdbid)
    .then((response) => response.json())
    .then((m) => m);
}

function updateUIDetails(m) {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector('.modal-body');
  modalBody.innerHTML = movieDetail;
}

function showCards(m) {
  return `<div class="col-md-4 my-3">
                <div class="card">
                    <img src="${m.Poster}" class="card-img-top" />
                    <div class="card-body">
                    <h5 class="card-title">${m.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                    <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#movieDetailModal" data-imdbid="${m.imdbID}" >Show Detail</a>
                    </div>
                </div>
            </div>`;
}

function showMovieDetail(m) {
  return `<div class="container-fluid">
              <div class="row">
                  <div class="col-md-3">
                  <img src="${m.Poster}" class="img-fluid" />
                  </div>
                  <div class="col-md">
                  <ul class="list-group">
                      <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                      <li class="list-group-item">
                      <strong>Director : </strong> ${m.Director}
                      </li>
                      <li class="list-group-item">
                      <strong>Actors : </strong> ${m.Actors}
                      </li>
                      <li class="list-group-item">
                      <strong>Writer : </strong> ${m.Writer}
                      </li>
                      <li class="list-group-item">
                      <strong>Plot : </strong><br />
                      ${m.Plot}
                      </li>
                  </ul>
                  </div>
              </div>
            </div>`;
}
