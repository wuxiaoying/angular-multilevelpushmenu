module = angular.module 'wxy.components', []

module.directive 'recursive', ['$compile', ($compile) ->
    restrict: 'EACM'
    priority: 100000
    compile: (tElement, tAttr) ->
        contents = tElement.contents().remove()
        compiledContents = null
        (scope, iElement, iAttr) ->
            compiledContents = $compile contents if not compiledContents
            compiledContents scope, (clone, scope) ->
                iElement.append clone
            return
]            