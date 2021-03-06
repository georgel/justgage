/**
 * JustGage - this is work-in-progress, unreleased, unofficial code, so it might not work top-notch :)
 * Check http://www.justgage.com for official releases
 * Licensed under MIT.
 * @author Bojan Djuricic  (@Toorshia)
 *
 * LATEST UPDATES

 * -----------------------------
 * March 13, 2013.
 * -----------------------------
     * refresh method - added optional 'max' parameter to use when you need to update max value

 * -----------------------------
 * February 26, 2013.
 * -----------------------------
     * decimals - option to define/limit number of decimals when not using humanFriendly or customRenderer to display value
     * fixed a missing parameters bug when calling generateShadow()  for IE < 9

 * -----------------------------
 * December 31, 2012.
 * -----------------------------
     * fixed text y-position for hidden divs - workaround for Raphael <tspan> 'dy' bug - https://github.com/DmitryBaranovskiy/raphael/issues/491
     * 'show' parameters, like showMinMax are now 'hide' because I am lame developer - please update these in your setups
     * Min and Max labels are now auto-off when in donut mode
     * Start angle in donut mode is now 90
     * donutStartAngle - option to define start angle for donut

 * -----------------------------
 * November 25, 2012.
 * -----------------------------
     * Option to define custom rendering function for displayed value

 * -----------------------------
 * November 19, 2012.
 * -----------------------------
     * Config.value is now updated after gauge refresh

 * -----------------------------
 * November 13, 2012.
 * -----------------------------
     * Donut display mode added
     * Option to hide value label
     * Option to enable responsive gauge size
     * Removed default title attribute
     * Option to accept min and max defined as string values
     * Option to configure value symbol
     * Fixed bad aspect ratio calculations
     * Option to configure minimum font size for all texts
     * Option to show shorthand big numbers (human friendly)
     */

 JustGage = function(config) {

  if (!config.id) {alert("Missing id parameter for gauge!"); return false;}
  if (!document.getElementById(config.id)) {alert("No element with id: \""+config.id+"\" found!"); return false;}

  var obj = this;

  // configurable parameters
  obj.config =
  {
    // id : string
    // this is container element id
    id : config.id,

    // title : string
    // gauge title
    title : (config.title) ? config.title : "",

    // titleFontColor : string
    // color of gauge title
    titleFontColor : (config.titleFontColor) ? config.titleFontColor : "#999999",

    // value : int
    // value gauge is showing
    value : (config.value) ? config.value : 0,

    // symbol : string
    // special symbol to show next to value
    symbol : (config.symbol) ? config.symbol : "",

    // valueFontColor : string
    // color of label showing current value
    valueFontColor : (config.valueFontColor) ? config.valueFontColor : "#010101",

    // min : int
    // min value
    min : (config.min) ? parseFloat(config.min) : 0,

    // max : int
    // max value
    max : (config.max) ? parseFloat(config.max) : 100,

    // humanFriendlyDecimal : int
    // number of decimal places for our human friendly number to contain
    humanFriendlyDecimal : (config.humanFriendlyDecimal) ? config.humanFriendlyDecimal : 0,

    // textRenderer: func
    // function applied before rendering text
    textRenderer  : (config.textRenderer) ? config.textRenderer : null,

    // gaugeWidthScale : float
    // width of the gauge element
    gaugeWidthScale : (config.gaugeWidthScale) ? config.gaugeWidthScale : 1.0,

    // gaugeColor : string
    // background color of gauge element
    gaugeColor : (config.gaugeColor) ? config.gaugeColor : "#edebeb",

    // label : string
    // text to show below value
    label : (config.label) ? config.label : "",

    // shadowOpacity : int
    // 0 ~ 1
    shadowOpacity : (config.shadowOpacity) ? config.shadowOpacity : 0.2,

    // shadowSize: int
    // inner shadow size
    shadowSize : (config.shadowSize) ? config.shadowSize : 5,

    // shadowVerticalOffset : int
    // how much shadow is offset from top
    shadowVerticalOffset : (config.shadowVerticalOffset) ? config.shadowVerticalOffset : 3,

    // levelColors : string[]
    // colors of indicator, from lower to upper, in RGB format
    levelColors : (config.levelColors) ? config.levelColors : [
    "#a9d70b",
    "#f9c802",
    "#ff0000"
    ],


    // labelFontColor : string
    // color of label showing label under value
    labelFontColor : (config.labelFontColor) ? config.labelFontColor : "#b3b3b3",

    // startAnimationTime : int
    // length of initial animation
    startAnimationTime : (config.startAnimationTime) ? config.startAnimationTime : 700,

    // startAnimationType : string
    // type of initial animation (linear, >, <,  <>, bounce)
    startAnimationType : (config.startAnimationType) ? config.startAnimationType : ">",

    // refreshAnimationTime : int
    // length of refresh animation
    refreshAnimationTime : (config.refreshAnimationTime) ? config.refreshAnimationTime : 700,

    // refreshAnimationType : string
    // type of refresh animation (linear, >, <,  <>, bounce)
    refreshAnimationType : (config.refreshAnimationType) ? config.refreshAnimationType : ">",

    // donutStartAngle : int
    // angle to start from when in donut mode
    donutStartAngle : (config.donutStartAngle) ? config.donutStartAngle : 90,

    // valueMinFontSize : int
    // absolute minimum font size for the value
    valueMinFontSize : config.valueMinFontSize || 16,

    // titleMinFontSize
    // absolute minimum font size for the title
    titleMinFontSize : config.titleMinFontSize || 10,

    // labelMinFontSize
    // absolute minimum font size for the label
    labelMinFontSize : config.labelMinFontSize || 10,

    // minLabelMinFontSize
    // absolute minimum font size for the minimum label
    minLabelMinFontSize : config.minLabelMinFontSize || 10,

    // maxLabelMinFontSize
    // absolute minimum font size for the maximum label
    maxLabelMinFontSize : config.maxLabelMinFontSize || 10,

    // hideValue : bool
    // hide value text
    hideValue : (config.hideValue) ? config.hideValue : false,

    // hideMinMax : bool
    // hide min and max values
    hideMinMax : (config.hideMinMax) ? config.hideMinMax : false,

    // hideInnerShadow : bool
    // hide inner shadow
    hideInnerShadow : (config.hideInnerShadow) ? config.hideInnerShadow : false,

    // humanFriendly : bool
    // convert large numbers for min, max, value to human friendly (e.g. 1234567 -> 1.23M)
    humanFriendly : (config.humanFriendly) ? config.humanFriendly : false,

    // noGradient : bool
    // whether to use gradual color change for value, or sector-based
    noGradient : (config.noGradient) ? config.noGradient : false,

    // donut : bool
    // show full donut gauge
    donut : (config.donut) ? config.donut : false,

    // relativeGaugeSize : bool
    // whether gauge size should follow changes in container element size
    relativeGaugeSize : (config.relativeGaugeSize) ? config.relativeGaugeSize : false,

    // counter : bool
    // animate level number change
    counter : (config.counter) ? config.counter : false,

    // counter : bool
    // animate level number change
    decimals : (config.decimals) ? config.decimals : 0
  };

  // variables
  var
  canvasW,
  canvasH,
  widgetW,
  widgetH,
  aspect,
  dx,
  dy,
  titleFontSize,
  titleX,
  titleY,
  valueFontSize,
  valueX,
  valueY,
  labelFontSize,
  labelX,
  labelY,
  minFontSize,
  minX,
  minY,
  maxFontSize,
  maxX,
  maxY;

  // overflow values
  if (this.config.value > this.config.max) this.config.value = this.config.max;
  if (this.config.value < this.config.min) this.config.value = this.config.min;
  this.originalValue = config.value;

  // canvas
  this.canvas = Raphael(this.config.id, "100%", "100%");
  if (this.config.relativeGaugeSize === true) {
    this.canvas.setViewBox(0, 0, 200, 150, true);
  }

  // canvas dimensions
  if (this.config.relativeGaugeSize === true) {
    canvasW = 200;
    canvasH = 150;
  } else {
    canvasW = getStyle(document.getElementById(this.config.id), "width").slice(0, -2) * 1;
    canvasH = getStyle(document.getElementById(this.config.id), "height").slice(0, -2) * 1;
  }

  // widget dimensions
  if (this.config.donut === true) {

    // DONUT *******************************

    // width more than height
    if(canvasW > canvasH) {
      widgetH = canvasH;
      widgetW = widgetH;
    // width less than height
  } else if (canvasW < canvasH) {
    widgetW = canvasW;
    widgetH = widgetW;
      // if height don't fit, rescale both
      if(widgetH > canvasH) {
        aspect = widgetH / canvasH;
        widgetH = widgetH / aspect;
        widgetW = widgetH / aspect;
      }
    // equal
  } else {
    widgetW = canvasW;
    widgetH = widgetW;
  }

    // delta
    dx = (canvasW - widgetW)/2;
    dy = (canvasH - widgetH)/2;

    // title
    titleFontSize = ((widgetH / 8) > 10) ? (widgetH / 10) : 10;
    titleX = dx + widgetW / 2;
    titleY = dy + widgetH / 11;

    // value
    valueFontSize = ((widgetH / 6.4) > 16) ? (widgetH / 5.4) : 18;
    valueX = dx + widgetW / 2;
    if(this.config.label !== '') {
      valueY = dy + widgetH / 1.85;
    } else {
      valueY = dy + widgetH / 1.7;
    }

    // label
    labelFontSize = ((widgetH / 16) > 10) ? (widgetH / 16) : 10;
    labelX = dx + widgetW / 2;
    labelY = valueY + labelFontSize;

    // min
    minFontSize = ((widgetH / 16) > 10) ? (widgetH / 16) : 10;
    minX = dx + (widgetW / 10) + (widgetW / 6.666666666666667 * this.config.gaugeWidthScale) / 2 ;
    minY = labelY;

    // max
    maxFontSize = ((widgetH / 16) > 10) ? (widgetH / 16) : 10;
    maxX = dx + widgetW - (widgetW / 10) - (widgetW / 6.666666666666667 * this.config.gaugeWidthScale) / 2 ;
    maxY = labelY;

  } else {
    // HALF *******************************

    // width more than height
    if(canvasW > canvasH) {
      widgetH = canvasH;
      widgetW = widgetH * 1.25;
      //if width doesn't fit, rescale both
      if(widgetW > canvasW) {
        aspect = widgetW / canvasW;
        widgetW = widgetW / aspect;
        widgetH = widgetH / aspect;
      }
    // width less than height
  } else if (canvasW < canvasH) {
    widgetW = canvasW;
    widgetH = widgetW / 1.25;
      // if height don't fit, rescale both
      if(widgetH > canvasH) {
        aspect = widgetH / canvasH;
        widgetH = widgetH / aspect;
        widgetW = widgetH / aspect;
      }
    // equal
  } else {
    widgetW = canvasW;
    widgetH = widgetW * 0.75;
  }

    // delta
    dx = (canvasW - widgetW)/2;
    dy = (canvasH - widgetH)/2;

    // title
    titleFontSize = ((widgetH / 8) > this.config.titleMinFontSize) ? (widgetH / 10) : this.config.titleMinFontSize;
    titleX = dx + widgetW / 2;
    titleY = dy + widgetH / 6.4;

    // value
    valueFontSize = ((widgetH / 6.5) > this.config.valueMinFontSize) ? (widgetH / 6.5) : this.config.valueMinFontSize;
    valueX = dx + widgetW / 2;
    valueY = dy + widgetH / 1.275;

    // label
    labelFontSize = ((widgetH / 16) > this.config.labelMinFontSize) ? (widgetH / 16) : this.config.labelMinFontSize;
    labelX = dx + widgetW / 2;
    labelY = valueY + valueFontSize / 2 + 5;

    // min
    minFontSize = ((widgetH / 16) > this.config.minLabelMinFontSize) ? (widgetH / 16) : this.config.minLabelMinFontSize;
    minX = dx + (widgetW / 10) + (widgetW / 6.666666666666667 * this.config.gaugeWidthScale) / 2 ;
    minY = labelY;

    // max
    maxFontSize = ((widgetH / 16) > this.config.maxLabelMinFontSize) ? (widgetH / 16) : this.config.maxLabelMinFontSize;
    maxX = dx + widgetW - (widgetW / 10) - (widgetW / 6.666666666666667 * this.config.gaugeWidthScale) / 2 ;
    maxY = labelY;
  }

  // parameters
  this.params  = {
    canvasW : canvasW,
    canvasH : canvasH,
    widgetW : widgetW,
    widgetH : widgetH,
    dx : dx,
    dy : dy,
    titleFontSize : titleFontSize,
    titleX : titleX,
    titleY : titleY,
    valueFontSize : valueFontSize,
    valueX : valueX,
    valueY : valueY,
    labelFontSize : labelFontSize,
    labelX : labelX,
    labelY : labelY,
    minFontSize : minFontSize,
    minX : minX,
    minY : minY,
    maxFontSize : maxFontSize,
    maxX : maxX,
    maxY : maxY
  };

  // var clear
  canvasW, canvasH, widgetW, widgetH, aspect, dx, dy, titleFontSize, titleX, titleY, valueFontSize, valueX, valueY, labelFontSize, labelX, labelY, minFontSize, minX, minY, maxFontSize, maxX, maxY = null

  // pki - custom attribute for generating gauge paths
  this.canvas.customAttributes.pki = function (value, min, max, w, h, dx, dy, gws, donut) {

    var alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi, path;

    if (donut) {
      alpha = (1 - 2 * (value - min) / (max - min)) * Math.PI;
      Ro = w / 2 - w / 7;
      Ri = Ro - w / 6.666666666666667 * gws;

      Cx = w / 2 + dx;
      Cy = h / 1.95 + dy;

      Xo = w / 2 + dx + Ro * Math.cos(alpha);
      Yo = h - (h - Cy) + 0 - Ro * Math.sin(alpha);
      Xi = w / 2 + dx + Ri * Math.cos(alpha);
      Yi = h - (h - Cy) + 0 - Ri * Math.sin(alpha);

      path += "M" + (Cx - Ri) + "," + Cy + " ";
      path += "L" + (Cx - Ro) + "," + Cy + " ";
      if (value > ((max - min) / 2)) {
        path += "A" + Ro + "," + Ro + " 0 0 1 " + (Cx + Ro) + "," + Cy + " ";
      }
      path += "A" + Ro + "," + Ro + " 0 0 1 " + Xo + "," + Yo + " ";
      path += "L" + Xi + "," + Yi + " ";
      if (value > ((max - min) / 2)) {
        path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx + Ri) + "," + Cy + " ";
      }
      path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx - Ri) + "," + Cy + " ";
      path += "Z ";

      return { path: path };

    } else {
      alpha = (1 - (value - min) / (max - min)) * Math.PI;
      Ro = w / 2 - w / 10;
      Ri = Ro - w / 6.666666666666667 * gws;

      Cx = w / 2 + dx;
      Cy = h / 1.25 + dy;

      Xo = w / 2 + dx + Ro * Math.cos(alpha);
      Yo = h - (h - Cy) + 0 - Ro * Math.sin(alpha);
      Xi = w / 2 + dx + Ri * Math.cos(alpha);
      Yi = h - (h - Cy) + 0 - Ri * Math.sin(alpha);

      path += "M" + (Cx - Ri) + "," + Cy + " ";
      path += "L" + (Cx - Ro) + "," + Cy + " ";
      path += "A" + Ro + "," + Ro + " 0 0 1 " + Xo + "," + Yo + " ";
      path += "L" + Xi + "," + Yi + " ";
      path += "A" + Ri + "," + Ri + " 0 0 0 " + (Cx - Ri) + "," + Cy + " ";
      path += "Z ";

      return { path: path };
    }

    // var clear
    alpha, Ro, Ri, Cx, Cy, Xo, Yo, Xi, Yi, path = null;
  };

  // gauge
  this.gauge = this.canvas.path().attr({
    "stroke": "none",
    "fill": this.config.gaugeColor,
    pki: [this.config.max, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH,  this.params.dx, this.params.dy, this.config.gaugeWidthScale, this.config.donut]
  });
  this.gauge.id = this.config.id+"-gauge";

  // level
  this.level = this.canvas.path().attr({
    "stroke": "none",
    "fill": getColorForPercentage((this.config.value - this.config.min) / (this.config.max - this.config.min), this.config.levelColors, this.config.noGradient),
    pki: [this.config.min, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH,  this.params.dx, this.params.dy, this.config.gaugeWidthScale, this.config.donut]
  });
  if(this.config.donut) {
    this.level.transform("r" + this.config.donutStartAngle + ", " + (this.params.widgetW/2 + this.params.dx) + ", " + (this.params.widgetH/1.95 + this.params.dy));
  }
  this.level.id = this.config.id+"-level";

  // title
  this.txtTitle = this.canvas.text(this.params.titleX, this.params.titleY, this.config.title);
  this.txtTitle.attr({
    "font-size":this.params.titleFontSize,
    "font-weight":"bold",
    "font-family":"Arial",
    "fill":this.config.titleFontColor,
    "fill-opacity":"1"
  });
  setDy(this.txtTitle, this.params.titleFontSize, this.params.titleY);
  this.txtTitle.id = this.config.id+"-txttitle";

  // value
  this.txtValue = this.canvas.text(this.params.valueX, this.params.valueY, 0);
  this.txtValue.attr({
    "font-size":this.params.valueFontSize,
    "font-weight":"bold",
    "font-family":"Arial",
    "fill":this.config.valueFontColor,
    "fill-opacity":"0"
  });
  setDy(this.txtValue, this.params.valueFontSize, this.params.valueY);
  this.txtValue.id = this.config.id+"-txtvalue";

  // label
  this.txtLabel = this.canvas.text(this.params.labelX, this.params.labelY, this.config.label);
  this.txtLabel.attr({
    "font-size":this.params.labelFontSize,
    "font-weight":"normal",
    "font-family":"Arial",
    "fill":this.config.labelFontColor,
    "fill-opacity":"0"
  });
  setDy(this.txtLabel, this.params.labelFontSize, this.params.labelY);
  this.txtLabel.id = this.config.id+"-txtlabel";

  // min
  this.txtMinimum = this.config.min;
  if( this.config.humanFriendly ) this.txtMinimum = humanFriendlyNumber( this.config.min, this.config.humanFriendlyDecimal );
  this.txtMin = this.canvas.text(this.params.minX, this.params.minY, this.txtMinimum);
  this.txtMin.attr({
    "font-size":this.params.minFontSize,
    "font-weight":"normal",
    "font-family":"Arial",
    "fill":this.config.labelFontColor,
    "fill-opacity": (this.config.hideMinMax || this.config.donut)? "0" : "1"
  });
  setDy(this.txtMin, this.params.minFontSize, this.params.minY);
  this.txtMin.id = this.config.id+"-txtmin";

  // max
  this.txtMaximum = this.config.max;
  if( this.config.humanFriendly ) this.txtMaximum = humanFriendlyNumber( this.config.max, this.config.humanFriendlyDecimal );
  this.txtMax = this.canvas.text(this.params.maxX, this.params.maxY, this.txtMaximum);
  this.txtMax.attr({
    "font-size":this.params.maxFontSize,
    "font-weight":"normal",
    "font-family":"Arial",
    "fill":this.config.labelFontColor,
    "fill-opacity": (this.config.hideMinMax || this.config.donut)? "0" : "1"
  });
  setDy(this.txtMax, this.params.maxFontSize, this.params.maxY);
  this.txtMax.id = this.config.id+"-txtmax";

  var defs = this.canvas.canvas.childNodes[1];
  var svg = "http://www.w3.org/2000/svg";

  if (ie < 9) {
    onCreateElementNsReady(function() {
      this.generateShadow(svg, defs);
    });
  } else {
    this.generateShadow(svg, defs);
  }

  // var clear
  defs, svg = null;

  if(!obj.config.counter) {
    if(obj.config.textRenderer) {
      obj.originalValue = obj.config.textRenderer(obj.originalValue);
    } else if(obj.config.humanFriendly) {
      obj.originalValue = humanFriendlyNumber( obj.originalValue, obj.config.humanFriendlyDecimal ) + obj.config.symbol;
    } else {
      obj.originalValue = (obj.originalValue * 1).toFixed(obj.config.decimals);
    }

    obj.txtValue.attr("text", obj.originalValue + obj.config.symbol);
    setDy(obj.txtValue, obj.params.valueFontSize, obj.params.valueY);
  }

  // animate gauge level
  this.level.animate({pki: [this.config.value, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH,  this.params.dx, this.params.dy, this.config.gaugeWidthScale, this.config.donut]},  this.config.startAnimationTime, this.config.startAnimationType);

  // animate value
  this.txtValue.animate({"fill-opacity":"1"}, this.config.startAnimationTime, this.config.startAnimationType);

  // animate label
  this.txtLabel.animate({"fill-opacity":"1"}, this.config.startAnimationTime, this.config.startAnimationType);
};

/** Refresh gauge level */
JustGage.prototype.refresh = function(val, max) {

  var originalVal, displayVal, color, max = max || null;

  // set new max
  if(max !== null) {
    this.config.max = max;

    this.txtMaximum = this.config.max;
    if( this.config.humanFriendly ) this.txtMaximum = humanFriendlyNumber( this.config.max, this.config.humanFriendlyDecimal );
    this.txtMax.attr({"text" : this.config.max});
    setDy(this.txtMax, this.params.maxFontSize, this.params.maxY);
  }

  // overflow values
  originalVal = val;
  displayVal = val.toFixed(this.config.decimals);
  if (val > this.config.max) {val = this.config.max;}
  if (val < this.config.min) {val = this.config.min;}

  color = getColorForPercentage((val - this.config.min) / (this.config.max - this.config.min), this.config.levelColors, this.config.noGradient);

  if(this.config.textRenderer) {
    displayVal = this.config.textRenderer(displayVal);
  } else if( this.config.humanFriendly ) {
    displayVal = humanFriendlyNumber( displayVal, this.config.humanFriendlyDecimal ) + this.config.symbol;
  } else {
    displayVal += this.config.symbol;
  }

  if(!this.config.counter) {
    this.canvas.getById(this.config.id+"-txtvalue").attr({"text":displayVal});
    setDy(this.canvas.getById(this.config.id+"-txtvalue"), this.params.valueFontSize, this.params.valueY);
  }

  this.canvas.getById(this.config.id+"-level").animate({pki: [val, this.config.min, this.config.max, this.params.widgetW, this.params.widgetH,  this.params.dx, this.params.dy, this.config.gaugeWidthScale, this.config.donut], "fill":color},  this.config.refreshAnimationTime, this.config.refreshAnimationType);
  this.config.value = val;

  // var clear
  originalVal, displayVal, color, max = null;
};

/** Generate shadow */
JustGage.prototype.generateShadow = function(svg, defs) {

    var gaussFilter, feOffset, feGaussianBlur, feComposite1, feFlood, feComposite2, feComposite3;

    // FILTER
    gaussFilter=document.createElementNS(svg,"filter");
    gaussFilter.setAttribute("id", this.config.id + "-inner-shadow");
    defs.appendChild(gaussFilter);

    // offset
    feOffset = document.createElementNS(svg,"feOffset");
    feOffset.setAttribute("dx", 0);
    feOffset.setAttribute("dy", this.config.shadowVerticalOffset);
    gaussFilter.appendChild(feOffset);

    // blur
    feGaussianBlur = document.createElementNS(svg,"feGaussianBlur");
    feGaussianBlur.setAttribute("result","offset-blur");
    feGaussianBlur.setAttribute("stdDeviation", this.config.shadowSize);
    gaussFilter.appendChild(feGaussianBlur);

    // composite 1
    feComposite1 = document.createElementNS(svg,"feComposite");
    feComposite1.setAttribute("operator","out");
    feComposite1.setAttribute("in", "SourceGraphic");
    feComposite1.setAttribute("in2","offset-blur");
    feComposite1.setAttribute("result","inverse");
    gaussFilter.appendChild(feComposite1);

    // flood
    feFlood = document.createElementNS(svg,"feFlood");
    feFlood.setAttribute("flood-color","black");
    feFlood.setAttribute("flood-opacity", this.config.shadowOpacity);
    feFlood.setAttribute("result","color");
    gaussFilter.appendChild(feFlood);

    // composite 2
    feComposite2 = document.createElementNS(svg,"feComposite");
    feComposite2.setAttribute("operator","in");
    feComposite2.setAttribute("in", "color");
    feComposite2.setAttribute("in2","inverse");
    feComposite2.setAttribute("result","shadow");
    gaussFilter.appendChild(feComposite2);

    // composite 3
    feComposite3 = document.createElementNS(svg,"feComposite");
    feComposite3.setAttribute("operator","over");
    feComposite3.setAttribute("in", "shadow");
    feComposite3.setAttribute("in2","SourceGraphic");
    gaussFilter.appendChild(feComposite3);

    // set shadow
    if (!this.config.hideInnerShadow) {
      this.canvas.canvas.childNodes[2].setAttribute("filter", "url(#" + this.config.id + "-inner-shadow)");
      this.canvas.canvas.childNodes[3].setAttribute("filter", "url(#" + this.config.id + "-inner-shadow)");
    }

    // var clear
    gaussFilter, feOffset, feGaussianBlur, feComposite1, feFlood, feComposite2, feComposite3 = null;

  };

  /** Get color for value percentage */
  function getColorForPercentage(pct, col, noGradient) {

    var no, inc, colors, percentage, rval, gval, bval, lower, upper, range, rangePct, pctLower, pctUpper, color;

    no = col.length;
    if (no === 1) return col[0];
    inc = (noGradient) ? (1 / no) : (1 / (no - 1));
    colors = [];
    for (var i = 0; i < col.length; i++) {
      percentage = (noGradient) ? (inc * (i + 1)) : (inc * i);
      rval = parseInt((cutHex(col[i])).substring(0,2),16);
      gval = parseInt((cutHex(col[i])).substring(2,4),16);
      bval = parseInt((cutHex(col[i])).substring(4,6),16);
      colors[i] = { pct: percentage, color: { r: rval, g: gval, b: bval  } };
    }

    if(pct === 0) {
      return 'rgb(' + [colors[0].color.r, colors[0].color.g, colors[0].color.b].join(',') + ')';
    }

    for (var j = 0; j < colors.length; j++) {
      if (pct <= colors[j].pct) {
        if (noGradient) {
          return 'rgb(' + [colors[j].color.r, colors[j].color.g, colors[j].color.b].join(',') + ')';
        } else {
          lower = colors[j - 1];
          upper = colors[j];
          range = upper.pct - lower.pct;
          rangePct = (pct - lower.pct) / range;
          pctLower = 1 - rangePct;
          pctUpper = rangePct;
          color = {
            r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
            g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
            b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
          };
          return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
        }
      }
    }

  }

  /** Fix Raphael display:none tspan dy attribute bug */
  function setDy(elem, fontSize, txtYpos) {
    elem.node.firstChild.attributes.dy.value = 0;
  }

  /** Random integer  */
  function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**  Cut hex  */
  function cutHex(str) {return (str.charAt(0)=="#") ? str.substring(1,7):str;}

  /**  Human friendly number suffix */
// From: http://stackoverflow.com/questions/2692323/code-golf-friendly-number-abbreviator
function humanFriendlyNumber( n, d ) {
  var p, d2, i, s;

  p = Math.pow;
  d2 = p(10, d);
  i = 7;
  while( i ) {
    s = p(10,i--*3);
    if( s <= n ) {
     n = Math.round(n*d2/s)/d2+"KMGTPE"[i];
   }
 }
 return n;
}

/**  Get style  */
function getStyle(oElm, strCssRule){
	var strValue = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
	}
	else if(oElm.currentStyle){
		strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		strValue = oElm.currentStyle[strCssRule];
	}
	return strValue;
}

/**  Create Element NS Ready  */
function onCreateElementNsReady(func) {
  if (document.createElementNS !== undefined) {
    func();
  } else {
    setTimeout(function() { onCreateElementNsReady(func); }, 100);
  }
}

/**  Get IE version  */
// ----------------------------------------------------------
// A short snippet for detecting versions of IE in JavaScript
// without resorting to user-agent sniffing
// ----------------------------------------------------------
// If you're not in IE (or IE version is less than 5) then:
// ie === undefined
// If you're in IE (>=5) then you can determine which version:
// ie === 7; // IE7
// Thus, to detect IE:
// if (ie) {}
// And to detect the version:
// ie === 6 // IE6
// ie > 7 // IE8, IE9 ...
// ie < 9 // Anything less than IE9
// ----------------------------------------------------------
// UPDATE: Now using Live NodeList idea from @jdalton
var ie = (function(){

  var undef,
  v = 3,
  div = document.createElement('div'),
  all = div.getElementsByTagName('i');

  while (
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
    all[0]
    );
    return v > 4 ? v : undef;
}());
