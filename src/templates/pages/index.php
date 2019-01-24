<?php require_once($_SERVER['DOCUMENT_ROOT'] . '/src/lib/_lib.php'); ?>
<?php template(
  'partials/_header',
  array(
    'title' => 'Hello World',
    'description' => 'Hello world description'
  )
) ?>

<?php template('components/_banner'); ?>

<?php template('partials/_footer'); ?>
