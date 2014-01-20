module = angular.module 'wxy.pushmenu', ['ngAnimate', 'wxy.components']

module.directive 'wxyPushMenu', ['wxyOptions', 'wxyUtils', (wxyOptions, wxyUtils) ->
    scope: 
        menu: '='
        options: '='
    controller: ($scope, $element, $attrs) ->
        $scope.options = options = angular.extend wxyOptions, $scope.options
        $scope.level = 0
        $scope.visible = true

        # Calculate width. I don't think this is actually used anywhere right now.
        width = options.menuWidth || 265
        $element.find('nav').width(width + options.overlapWidth * wxyUtils.DepthOf $scope.menu)

        this.GetBaseWidth = -> width
        this.GetOptions = -> options
        return
    templateUrl: 'partials/MainMenu.html' 
    restrict: 'E'
    replace: true
]

module.directive 'wxySubmenu', ['$animate', 'wxyUtils', ($animate, wxyUtils) ->
    scope: 
        menu: '='
        level: '='
        visible: '='
    link: (scope, element, attr, ctrl) ->
        scope.options = options = ctrl.GetOptions()
        scope.childrenLevel = scope.level + 1

        # Handler for when a menu is opened. 
        onOpen = ->
            console.log 'onopen'
            element.width ctrl.GetBaseWidth()
            scope.inactive = false if !scope.collapsed
            scope.$emit 'submenuOpened', scope.level
            return

        # Collapse and uncollapse the main menu. 
        if scope.level == 0
            scope.collasped = false
            marginCollapsed = options.overlapWidth - ctrl.GetBaseWidth()
            if options.collapsed
                scope.collapsed = true
                scope.inactive = true
                element.css marginLeft: marginCollapsed
    
            collapse = ->
                scope.collapsed = !scope.collapsed
                scope.inactive = scope.collapsed
            
                $.data element, 'from', if scope.collapsed then 0 else marginCollapsed
                $.data element, 'to', if scope.collapsed then marginCollapsed else 0
                if scope.collapsed then options.onCollapseMenuStart() else options.onExpandMenuStart()
                $animate.addClass element, 'slide', ->
                    scope.$apply -> 
                            if scope.collapsed then options.onCollapseMenuEnd() else options.onExpandMenuEnd()
                        return
                    return
                wxyUtils.PushContainers options.containersToPush, if scope.collapsed then marginCollapsed else 0
                return

        # Event handler for when the menu icon is clicked. 
        scope.openMenu = (event, menu) ->
            wxyUtils.StopEventPropagation event
            scope.$broadcast 'menuOpened', scope.level
            options.onTitleItemClick event, menu
            # If we are on the main menu then we collapse or uncollapse the menu. 
            # Otherwise, open the menu item that was clicked.
            if scope.level == 0 && !scope.inactive || scope.collapsed
                collapse() 
            else
                onOpen()
            return

        # Event handler for when a submenu list item is clicked. 
        scope.onSubmenuClicked = (item, $event) ->
            # If the item is a group item then open the group and inactivate the current menu. 
            if item.menu
                item.visible = true
                scope.inactive = true
                options.onGroupItemClick $event, item
            else
                options.onItemClick $event, item
            return

        # Event handler for when the back item is clicked. 
        scope.goBack = (event, menu) ->
            options.onBackItemClick event, menu
            scope.visible = false
            scope.$emit 'submenuClosed', scope.level

        # Activate open handler when the menu becomes visible.
        scope.$watch 'visible', (visible) =>
            if visible
                if scope.level > 0
                    options.onExpandMenuStart()
                    # HACK: pass width to animate since ngAnimate doesn't allow optional parameters.
                    $.data element, 'from', -ctrl.GetBaseWidth() 
                    $.data element, 'to', 0
                    $animate.addClass element, 'slide', ->
                        scope.$apply -> 
                            options.onExpandMenuEnd()
                            return
                        return
                onOpen() 
            return

        # Event listener for when a submenu is opened. Corrects the width for the menu. 
        scope.$on 'submenuOpened', (event, level) =>
            correction = level - scope.level
            correctionWidth = options.overlapWidth * correction
            element.width ctrl.GetBaseWidth() + correctionWidth
            wxyUtils.PushContainers options.containersToPush, correctionWidth if scope.level == 0
            return

        # Event listener for when a submenu is closed. Opens the parent of the submenu. 
        scope.$on 'submenuClosed', (event, level) =>
            if level - scope.level == 1
                onOpen()
                wxyUtils.StopEventPropagation event
            return

        # Event listener for when a parent menu is opened. Closes all of the submenus. 
        scope.$on 'menuOpened', (event, level) =>
            scope.visible = false if scope.level - level > 0
            return

        return
    templateUrl: 'partials/SubMenu.html'
    require: '^wxyPushMenu'
    restrict: 'EA'
    replace: true
]

module.factory 'wxyUtils', ->
    # Stop propgation for cross browser
    StopEventPropagation = (e) ->
        if e.stopPropagation and e.preventDefault
            e.stopPropagation()
            e.preventDefault()
        else
            e.cancelBubble = true
            e.returnValue = false
        return

    # Calculates the depth of a menu by looking at the item array.
    DepthOf = (menu) ->
        maxDepth = 0
        if menu.items
            for item in menu.items
                depth = DepthOf(item.menu) + 1 if item.menu
                maxDepth = depth if depth > maxDepth
        maxDepth

    # Pushes containers as the menu width changes. 
    PushContainers = (containersToPush, absoluteDistance) ->
        return if not containersToPush
        $.each containersToPush, ->
            $(this).stop().animate marginLeft: absoluteDistance

    StopEventPropagation: StopEventPropagation
    DepthOf: DepthOf
    PushContainers: PushContainers

module.animation '.slide', ->
    addClass: (element, className, onAnimationCompleted) ->
        element.removeClass className
        element.css marginLeft: $.data element, 'from'
        element.animate marginLeft: $.data(element, 'to'), onAnimationCompleted
        return

module.value 'wxyOptions', 
    containersToPush: null
    wrapperClass: 'multilevelpushmenu_wrapper'
    menuInactiveClass: 'multilevelpushmenu_inactive' # not implemented
    menuWidth: 0 # not implemented
    menuHeight: 0 # not implemented
    collapsed: false
    fullCollapse: true # not implemented
    direction: 'ltr'
    backText: 'Back'
    backItemClass: 'backItemClass'
    backItemIcon: 'fa fa-angle-right'
    groupIcon: 'fa fa-angle-left' 
    mode: 'overlap' # not implemented
    overlapWidth: 40
    preventItemClick: true # not implemented
    preventGroupItemClick: true # not implemented
    swipe: 'both' # not implemented
    onCollapseMenuStart: -> # not implemented
    onCollapseMenuEnd: -> # not implemented
    onExpandMenuStart: -> 
    onExpandMenuEnd: -> 
    onGroupItemClick: ->
    onItemClick: ->
    onTitleItemClick: ->
    onBackItemClick: ->
    onMenuReady: -> # not implemented


