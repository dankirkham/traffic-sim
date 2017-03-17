var tests = [];
for (var file in window.__karma__.files) {
    if (/\_test\.js$/.test(file)) {
        tests.push(file);
    }
}

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/build_test',

    paths: {},
    shim: {},

    // dynamically load all test files
    //deps: allTestFiles,
    //
    deps: tests,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});
