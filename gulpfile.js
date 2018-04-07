const
    browserSync = require('browser-sync').create(),
    gulp =  require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin')
;

const path = {
    src:{
        html:'src/*.html',
        scss:'src/scss/*.scss',
        js:'src/js/*.js',
        css:'src/css/',
        img:'src/img/*',
    },
    build:{
        html:'prod/',
        js:'prod/js/',
        css:'prod/css/',
        img:'prod/img/',
    }
};

gulp.task('test', ()=>{return console.log('gulp is running')})

// *******************DEV**************//
gulp.task('sass', ()=>{
    gulp.src(path.src.scss)
    .pipe(sass())
    .pipe(gulp.dest(path.src.css))
    .pipe(browserSync.stream());
})


gulp.task('serve', ['test', 'sass'], () =>{
    browserSync.init({
        server:'./src/'
    });
    gulp.watch([path.src.scss], ['sass', browserSync.reload ]);
    gulp.watch([path.src.html]).on('change', browserSync.reload);
    gulp.watch([path.src.js]).on('change', browserSync.reload);
    gulp.watch([path.src.img]).on('change', browserSync.reload);
    gulp.watch(['./src/css/*.css'],['dangercss', browserSync.reload ]);
    
})

gulp.task('default', ['serve'])



// *******************BUILD**************//
gulp.task('htmlBuild', ()=>{
    gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
})
gulp.task('jsBuild', () => {
    gulp.src([path.src.js])
    .pipe(gulp.dest(path.build.js))
})
gulp.task('cssBuild', ()=>{
    gulp.src(path.src.css.concat('*.css'))
    .pipe(gulp.dest(path.build.css))
})
gulp.task('imgBuild', ()=>{
    gulp.src(path.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(path.build.img))
})
gulp.task('build', ['htmlBuild', 'jsBuild', 'cssBuild', 'imgBuild'])

gulp.task('serveBuild',['build'], ()=>{
    browserSync.init({
        server:'./prod/',
        port: 3000,
    });
})
