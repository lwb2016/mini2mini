const del = require('del')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')()
const minimist = require('minimist')
const argv = minimist(process.argv.slice(2))

const getType=function(plat){
  if(plat=='wx'){
    return ['wx','wxss','wxml']
  }else if(plat=='qq'){
    return ['qq','qss','qml']
  }else if(plat=='tt'){
    return ['tt','ttss','ttml']
  }
}

//获取对应的类型
const plat1=getType(argv.p1)
const plat2=getType(argv.p2)

console.log(plat1,plat2)

const platfoms=[plat1[0],plat2[0]]
const css=[plat1[1],plat2[1]]
const xmls=[plat1[2],plat2[2]]

// 变量
const SRC = argv.src
const DEST = argv.dest
const wxssFiles = SRC + '/**/*.'+css[0]
const jsFiles = SRC + '/**/*.js'
const wxmlFiles = SRC + '/**/*.'+xmls[0]
const images = SRC + '/**/*.{png,jpg,jpeg,gif,ico,svg}'
const otherFiles = [
  SRC + '/**/*',
  '!' + SRC + `/**/*.{${css[0]},js,${xmls[0]},png,jpg,jpeg,gif,ico,svg}`
]

// 清除输出目录
gulp.task('clean', function(cb) {
  return del(DEST, { force: true }).then(() => {
    cb()
  })
})

// 处理wxss
gulp.task(css[0], function() {
  return (
    gulp
      .src(wxssFiles)
      // 输出信息
      .pipe($.debug({ title: `[${css[0]} 文件]` }))
      // 缓存(watch模式下)
      .pipe($.if(argv.watch, $.cached(css[0])))
      // 重命名
      .pipe(
        $.rename({
          extname: '.'+css[1]
        })
      )
      // 引入文件后缀
      .pipe($.replace('.'+css[0], '.'+css[1]))
      // 缓存(watch模式下)
      .pipe($.if(argv.watch, $.remember(css[0])))
      // 压缩
      .pipe($.if(argv.minify || argv['minify-css'], $.cleanCss()))
      .pipe(gulp.dest(DEST))
  )
})

// 处理js
gulp.task('js', function() {
  return (
    gulp
      .src(jsFiles)
      // 输出信息
      .pipe($.debug({ title: '[js 文件]' }))
      // 缓存(watch模式下)
      .pipe($.if(argv.watch, $.cached('js')))
      // wx. -> tt.
      .pipe($.replace(platfoms[0]+'.', platfoms[1]+'.'))
      // 缓存(watch模式下)
      .pipe($.if(argv.watch, $.remember('js')))
      // babel 转化
      .pipe(
        $.if(
          argv.minify || argv['minify-js'],
          $.babel({
            presets: ['@babel/env']
          })
        )
      )
      .pipe($.if(argv.minify || argv['minify-js'], $.uglify())) // 压缩
      .pipe(gulp.dest(DEST))
  )
})

// 处理wxml文件
gulp.task(xmls[0], function() {
  return (
    gulp
      .src(wxmlFiles)
      // 输出信息
      .pipe($.debug({ title: `[${xmls[0]} 文件]` }))
      // 缓存(watch模式下)
      .pipe($.if(argv.watch, $.cached(xmls[0])))
      // wx. -> tt.
      .pipe($.replace(platfoms[0]+':', platfoms[1]+':'))
      // 缓存(watch模式下)
      .pipe($.if(argv.watch, $.remember(xmls[0])))
      // 重命名
      .pipe(
        $.rename({
          extname: '.'+xmls[1]
        })
      )
      // 压缩
      .pipe(
        $.if(
          argv.minify || argv['minify-xml'],
          $.htmlmin({ collapseWhitespace: true })
        )
      )
      .pipe(gulp.dest(DEST))
  )
})

// 处理图片
gulp.task('images', function() {
  return (
    gulp
      .src(images)
      .pipe($.debug({ title: '[image 文件]' }))
      .pipe($.if(argv.watch, $.cached('images')))
      // 压缩图片
      .pipe(
        $.imagemin(),
        {
          verbose: true
        }
      )
      .pipe(gulp.dest(DEST))
  )
})

// 其他文件
gulp.task('others', function() {
  return gulp
    .src(otherFiles)
    .pipe($.debug({ title: '[other files]' }))
    .pipe($.if(argv.watch, $.cached('others')))
    .pipe(gulp.dest(DEST))
})

if (argv.watch) {
  // 监控模式
  gulp.task('watch', function() {
    gulp.watch(wxssFiles, gulp.series(css[0]))
    gulp.watch(jsFiles, gulp.series('js'))
    gulp.watch(wxmlFiles, gulp.series(xmls[0]))
    gulp.watch(images, gulp.series('images'))
    gulp.watch(otherFiles, gulp.series('others'))
  })

  gulp.task(
    'default',
    gulp.series(
      'clean',
      gulp.parallel(css[0], 'js', 'images', xmls[0], 'others'),
      'watch'
    )
  )
} else {
  gulp.task(
    'default',
    gulp.series(
      'clean',
      gulp.parallel(css[0], 'js', 'images', xmls[0], 'others')
    )
  )
}
