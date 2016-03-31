var scopeInspectorGetScope = function scopeInspectorGetScopeFunction() {
  var scope,
    isolatedScope,
    element,
    copy = {
      __proto__: null
    },
    editor = 'undefined' !== typeof _getPlainNBS ? true : false,
    _ = editor ? _getPlainNBS() : window,
    ng = _.angular,
    hasAngular = 'undefined' !== _.angular ? true : false;

  function makeCopy(scope, full) {
    var copy = {
        __proto__: null
      },
      properties, i;

    properties = Object.getOwnPropertyNames(scope);
    for (i = 0; i < properties.length; ++i) {
      if (full || (properties[i] !== 'this' && properties[i][0] !== '$')) {
        copy[properties[i]] = scope[properties[i]];
      }
    }
    return copy;
  }

  function getAngularVersion(version) {
    var intVersion = 0;

    if (typeof(version) == "object") {
      intVersion = parseInt('' + version.major + '' + version.minor + '' + version.dot + '');
    }

    return intVersion;
  }

  function isolateScopeAvailable(a) {
    var version = 0;

    if (typeof(a) == "object") {
      version = getAngularVersion(a.version);
    }

    if (version > 108) {
      return true;
    }

    return false;
  }

  if (hasAngular) {
    element = ng.element(_.$0);
    scope = element.scope();

    isolatedScope = isolateScopeAvailable(ng) ? element.isolateScope() : false;

    if (scope) {
      copy.scopeId = scope.$id;
      copy.siteConfig = makeCopy(scope.siteConfig, false);
      copy.pageConfig = makeCopy(scope.pageConfig, false);
      copy.properties = makeCopy(scope, false);
      copy.$scope = {
	fullScope: makeCopy(scope, true),
        controller: element.controller()['__proto__'],
        isIsolatedScope: isolatedScope ? true : false,
        isInherited: element.hasClass('ng-scope') ? false : true
      }
    }

  }

  return copy;
}

chrome.devtools.panels.elements.createSidebarPane(
  "Scope Inspector",
  function scopeInspectorCreateSidebar(sidebar) {
    function updateElementProperties() {
      sidebar.setExpression("(" + scopeInspectorGetScope.toString() + ")()");
    }
    updateElementProperties();
    chrome.devtools.panels.elements.onSelectionChanged.addListener(
      updateElementProperties);
  });
