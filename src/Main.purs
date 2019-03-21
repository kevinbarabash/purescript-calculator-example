module Main where

import Prelude

import Calculator (calculator)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Exception (throw)
import React.Basic.DOM (render)
import Web.DOM.NonElementParentNode (getElementById)
import Web.HTML (window)
import Web.HTML.HTMLDocument (toNonElementParentNode)
import Web.HTML.Window (document)
import Effect.Unsafe (unsafePerformEffect)

main :: Effect Unit
main = do
    win <- window
    doc <- document win
    container <- getElementById "container" $ toNonElementParentNode doc
    case container of
        Nothing -> throw "Container element not found!"
        Just c  ->
            let app = calculator {}
            in render app c
