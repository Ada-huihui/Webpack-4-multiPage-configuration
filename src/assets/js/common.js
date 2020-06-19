/*
 * @Date: 2020-06-17 16:13:35
 * @Description:公有js
 * @Author: Ada
 * @FilePath: \official-website\src\assets\js\common.js
 * @LastEditors: Ada
 * @LastEditTime: 2020-06-17 16:59:12
 */
;(function () {
  'use strict'

  var $searchView = $('.menu-search-container')
  var $menu = $(
    '.menu-know, .menu-product, .menu-service, .menu-cooperation, .menu-mediaVideo, .menu-contactus, .menu-search, .menu-store'
  )
  var $fadeScreen = $('.fade-screen')

  $('li.menu-search a, .fade-screen, .menu-search-close').on('click', function (
    e
  ) {
    $searchView.toggleClass('active')

    setTimeout(function () {
      $searchView.children().find('input').focus()
    }, 1100)

    $fadeScreen.toggleClass('visible')
    $menu.removeClass('is-closed')
    $menu.toggleClass('hidden')

    e.preventDefault()
  })

  $('.fade-screen,.menu-search-close').on('click', function (e) {
    $menu.toggleClass('is-closed')
    e.preventDefault()
  })
})()
