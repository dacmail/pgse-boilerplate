<?php

// Include template files and pass variables
function template($template, $variables = array()) {
  $output = null;

  global $strings;

  $file = $_SERVER['DOCUMENT_ROOT'] . '/src/templates/' . $template . '.php';

  if (file_exists($file)) {
      if (array_key_exists($template, $strings)) {
        extract(array_merge($strings[$template], $variables));
      } else {
        extract($variables);
      }
      ob_start();
      include $file;
      $output = ob_get_clean();
  }

  print $output;
}


//Inline svgs
function inline_svg($path, $alt = 'replace this dummy text', $title = 'replace this dummy text', $css_class = null) {
  if (empty($path)) {
    return false;
  }

  if (empty($alt)) {
    $alt = dummy_text();
  }

  if (empty($title)) {
    $title = dummy_text();
  }

  if (isset($css_class) && !empty($css_class)){
    $css_class = ' class="'.$css_class.'"';
  }
  return '<img'.$css_class.' src="images/' . $path .'" alt="'.$alt.'" title="'.$title.'">';
}

function dummy_text() {
  return 'replace this dummy text';
}
