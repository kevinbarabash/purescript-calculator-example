module Calculator where
  
import Prelude

import Data.Function (flip)
import Data.Maybe (Maybe(..))
import Data.String (Pattern(..), Replacement(..), replace)
import Data.String.Utils (includes, startsWith)
import Global (readFloat)
import React.Basic (make, JSX, createComponent)
import React.Basic.DOM as R
import React.Basic.DOM.Events (capture_)

type Props = {}

buttonWidth :: Int
buttonWidth = 60

buttonStyle :: R.CSS
buttonStyle = R.css 
  { fontSize: 24
  , width: buttonWidth
  , height: 48
  , border: "none"
  , background: "#666"
  , color: "#FFF"
  , fontFamily: "system-ui"
  , fontWeight: 100
  , dispaly: "flex"
  , justifyContent: "center"
  , alignContent: "center"
  , padding: 0
  }

operationStyle :: R.CSS
operationStyle = R.mergeStyles [
  buttonStyle,
  R.css 
    { background: "#F90"
    , fontSize: 32
    }
]

containerStyle :: R.CSS
containerStyle = R.css
  { display: "grid"
  , gridTemplateColumns: "auto auto auto auto"
  , width: 4 * buttonWidth + 3
  , background: "#333"
  , gridGap: 1
  , borderRadius: 4
  , overflow: "hidden"
  }

readoutStyle :: R.CSS
readoutStyle = R.css
  { gridColumn: "1 / span 4"
  , fontSize: 48
  , textAlign: "right"
  , border: "solid 1px black"
  , height: 80
  , display: "flex"
  , justifyContent: "flex-end"
  , alignItems: "flex-end"
  , paddingRight: 8
  , fontFamily: "system-ui"
  , color: "#FFF"
  , fontWeight: 100
  , overflow: "hidden"
  }

type BinaryOp = Number -> Number -> Number

type State = {value :: String, operation :: Maybe BinaryOp, stack :: String }

handleNumber :: String -> State -> State
handleNumber key s = case s of
  {value: "0", operation: Nothing, stack: ""} -> s { value = key }
  {value, operation: Nothing, stack: ""} -> s { value = value <> key }
  {value, operation, stack: ""} -> s { value = key, stack = value }
  {value, operation, stack} -> s {value = value <> key}

handleOperation :: BinaryOp -> State -> State
handleOperation op' s = case s of
  {value, operation: Nothing, stack} -> s { operation = Just op', stack = "" }
  {value, operation: Just op, stack: ""} -> s 
    { operation = Just op'
    , value = show $ flip op (readFloat value) (readFloat value)
    }
  {value, operation: Just op, stack} -> s 
    { operation = Just op'
    , value = show $ flip op (readFloat value) (readFloat stack)
    , stack = ""
    }

handleEquals :: State -> State
handleEquals s = case s of
  {value, operation: Nothing, stack} -> s
  {value, operation: Just op, stack: ""} -> s { value = show $ flip op (readFloat value) (readFloat value), stack = value }
  {value, operation: Just op, stack} -> s { value = show $ flip op (readFloat value) (readFloat stack) }

handleDecimal :: State -> State
handleDecimal s = case s of
  {value, operation: Nothing, stack: ""} -> s { value = enterDecimal value }
  {value, operation, stack: ""} -> s { value = enterDecimal "0", stack = value }
  {value, operation, stack} -> s {value = enterDecimal value}

enterDecimal :: String -> String
enterDecimal currentValue = if includes "." currentValue then currentValue else currentValue <> "."

toggleSign :: String -> String
toggleSign currentValue = do
  if currentValue == "0" then "0" else (
    if startsWith "-" currentValue then replace (Pattern "-") (Replacement "") currentValue else "-" <> currentValue
  )


calculator :: Props -> JSX
calculator = make (createComponent "Calculator") { initialState, render }
  where
    initialState = {value: "0", operation: Nothing, stack: ""} :: State

    render self = do
      let 
        genericButton :: String -> (State -> State) -> R.CSS -> JSX
        genericButton label handler style = 
          R.button
            { onClick: capture_ $ self.setState $ handler
            , children: [ R.text label ]
            , style: R.mergeStyles [buttonStyle, style]
            }

      let 
        numButton :: Int -> JSX
        numButton num = genericButton (show num) (handleNumber $ show num) buttonStyle

      let
        binOpButton :: String -> BinaryOp -> JSX
        binOpButton label op = genericButton label (handleOperation op) operationStyle

      let clearButton = genericButton "C" (\s -> s { value = "0", operation = Nothing, stack = "" }) buttonStyle
      let plusMinusButton = genericButton "\x00B1" (\s -> s { value = toggleSign s.value }) buttonStyle
      let percentButton = genericButton "%" (\s -> s { value = show $ 0.01 * (readFloat s.value) }) buttonStyle

      R.div { 
        children: [
          R.div {
            style: containerStyle,
            children: [
              R.div { 
                children: [ R.text self.state.value ],
                style: readoutStyle
              },

              clearButton, plusMinusButton, percentButton, binOpButton "\x00F7" (/),
              numButton 7, numButton 8, numButton 9, binOpButton "\x00D7" (*),
              numButton 4, numButton 5, numButton 6, binOpButton "\x002D" (-),
              numButton 1, numButton 2, numButton 3, binOpButton "+" (+),

              genericButton "0" (handleNumber "0") (R.css { gridColumn: "1 / span 2", width: 2 * buttonWidth + 1 }),
              genericButton "." handleDecimal buttonStyle,
              genericButton "=" handleEquals operationStyle
            ]
          }
        ]
      }
