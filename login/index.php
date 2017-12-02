<!doctype html>
<html ng-app="ajaxExample">
<head lang="en">
    <meta charset="utf-8">
    <title>Angular Ajax with PHP</title>
</head>
<body>

<h2>The form</h2>

<div ng-controller="mainController">

    
    <h2>The list</h2>
    <p>The names that were added with the form.</p>
    
    <ul>
        <li ng-repeat="person in people">
            <button ng-click="deletePerson( person.id )">Delete</button> {{ person.username }} {{ person.firstname }} {{ person.lastname }}
        </li>
    </ul>

</div>

 <script src="http://10.0.0.5/mobile/js/angular.min.js"></script>
 <script src="http://10.0.0.5/mobile/login/app.js"></script>

</body>
</html>