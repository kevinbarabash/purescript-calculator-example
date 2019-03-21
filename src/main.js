import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {calculator} from './Calculator.purs'

const render = Component => {
    ReactDOM.render(
        React.createElement(
            AppContainer, 
            {}, 
            React.createElement(calculator, {}),
        ),
        document.getElementById("container"),
    );
}

render(calculator);

// webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('./Calculator.purs', () => {
        const {calculator} = require('./Calculator.purs');
        render(calculator);
    });
}


// import Main from './Main.purs';

// const app = Main.main();

// // vanilla hot module reloading
// // @see https://webpack.js.org/guides/hot-module-replacement/
// if (module.hot) {
//     module.hot.accept();
// } else {
//     App.main()();
// }