<!DOCTYPE html>
<html lang="cs-CZ" xml:lang="cs-CZ" xmlns="http://www.w3.org/1999/xhtml" >
<head>
    <title>jQuery multiselect / Tomas Vrubl miniwork.eu</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1" />
    <link rel="stylesheet" href="css/ui.wmultiselect.css" type="text/css" />
    <link rel="stylesheet" href="prettify/prettify.css"  type="text/css" />
    <script src="js/jquery.min.js" type="text/javascript"></script>
    <script src="js/jquery-ui.min.js" type="text/javascript"></script>
    <script src="js/jquery.ui.wmultiselect.js" type="text/javascript"></script>
    <script src="prettify/prettify.js" type="text/javascript"></script>
    <style>
        body {font-family: "Helvetica Neue",Helvetica,Arial,sans-serif; width: 900px; margin: 30px auto;}
        p {line-height: 1.5}
        span.label {font-style: italic; margin-right: 20px;}
        footer {text-align: center; display: block; margin-top: 120px; color: #8C8C8C; font-size: 0.8em}
        .wmultiselect { max-width: 850px;}
        .screenshots {margin-bottom: 60px; overflow: auto;}
        figure {display: inline-block; margin: 10px;}
        figcaption {text-align: center; font-size: 0.8em;}
    </style>
    </head>
    <body onload="prettyPrint();">
        <h1>Multiselect / jQuery</h1>
        <p>
            Supports multi-value select. Values can be selected by popup browser or autocomplete. For remove item use 
            <b>BACKSPACE</b> or click on item by mouse.
            <br/><br/>            
        </p>
        <p> 
            <span class="label">Requirements:</span> jQuery / <a href="https://jquery.com/">https://jquery.com</a><br/>
            <span class="label">License:</span>GPLv3<br/>
            <span class="download label">Source code:</span><a href="jq_multiselect.zip"/>jq_multiselect.zip</a>
        </p>
        <h2>Example/demo</h2>
        <script>
                $(function(){
                    $('#employee').wmultiselect({
                        selected: ['ms'],
                        items: [{'v': 'ms', 'l': 'Melissa Stephens'},
                                {'v': 'mg', 'l': 'Madaline Garrett'},
                                {'v': 'jh', 'l': 'Jayme Hubbard'},
                                {'v': 'mw', 'l': 'Moses Wiley'},
                                {'v': 'bv', 'l': 'Beatrice Valenzuela'},
                                {'v': 'af', 'l': 'Aspen Finley'},
                                {'v': 'dh', 'l': 'Doris Harper'},
                                {'v': 'og', 'l': 'Oscar Garrison'},
                                {'v': 'cs', 'l': 'Cora Sellers'},
                                {'v': '20', 'l': 'Nola Carter'},
                                {'v': '19', 'l': 'Ivan Fuentes'},
                                {'v': '18', 'l': 'Hashim Mendez'},
                                {'v': '17', 'l': 'Madaline Padilla'},
                                {'v': '16', 'l': 'Derek Martin'},
                                {'v': '15', 'l': 'Tatyana Jacobson'},
                                {'v': '01', 'l': 'Ralph Spencer'},
                                {'v': '02', 'l': 'Dominic Jefferson'},
                                {'v': '03', 'l': 'Nelle Walter'},
                                {'v': '04', 'l': 'Athena Lloyd'},
                                {'v': '05', 'l': 'Jenette Mueller'},
                                {'v': '06', 'l': 'Jack Beard'},
                                {'v': '07', 'l': 'Echo Baird'},
                                {'v': '08', 'l': 'Chancellor Parker'},
                                {'v': '09', 'l': 'Idona Owen'},
                                {'v': '10', 'l': 'Raven Castillo'},
                                {'v': '11', 'l': 'Murphy Kelley'},
                                {'v': '12', 'l': 'Serina Garza'},
                                {'v': '13', 'l': 'Lamar Webb'},
                                {'v': '14', 'l': 'Nash Baldwin'}]
                    });
                    
                    
                    var values =  $('#employee').wmultiselect('value');
                });
            </script>           
            <div id="employee" style='margin-bottom: 50px;'></div>
            <h2>Code</h2>
            At first create element with ID
            
            <pre class="prettyprint lang-html">
                &lt;div id="employee"&gt;&lt;/div&gt;
            </pre>
            After that put javascript code            
            <pre class="prettyprint lang-html linenums">
                &lt;script type="text/javascript"&gt;
           
                $(function(){
                    $('#employee').wmultiselect({
                        selected: ['ms'],
                        items: [{'v': 'ms', 'l': 'Melissa Stephens'},
                                {'v': 'mg', 'l': 'Madaline Garrett'},
                                {'v': 'jh', 'l': 'Jayme Hubbard'},
                                {'v': 'mw', 'l': 'Moses Wiley'}]
                    });


                });
                &lt;script&gt;
            </pre>
            <p style="margin-top: 30px;">
                <b>Properties:</b><br/>
                <i>selected</i> - selected values []<br/>
                <i>items</i> - list of all items<br/>       

            </p>
            
            <h3>Get list of selected values</h3>
             <pre class="prettyprint lang-html ">
                &lt;script type="text/javascript"&gt;                
                var list = $('#employee').wmultiselect('value');
                &lt;script&gt;
            </pre>
                        
            <h3>Set list of selected values</h3>
             <pre class="prettyprint lang-html ">
                &lt;script type="text/javascript"&gt;                
                var list = $('#employee').wmultiselect('value', new Array());
                &lt;script&gt;
            </pre>
            
           
            <h2>Screenshots</h2>
            Here is some screenshots of usage.
            <div class='screenshots'>
                <figure>
                      <img src='screen1.png' alt='autocomplete' title="autocomplete view" />
                        <figcaption>Autocomplete view</figcaption>
                </figure>
                <figure>
                    <img src='screen2.png' alt='popup window' title="popup window" />
                    <figcaption>Popup view</figcaption>
                </figure>
             
            </div>
            <h2>Bug report</h2>
            <p>
                If you find bug please report to .... <b>dev@miniwork.eu</b>
            </p>
            <h2>Fix history</h2>
            <ul>
                <li>2015-11-03 - fixed popup window. Now, its possible to click on checkbox/item. Fixed set value refresh.</li>
            </ul>
            
            
            <footer>
                created by miniwork.eu / <a href="http://www.miniwork.eu">http://www.miniwork.eu</a>
                <br/><br/><br/>
                <!-- Kontextová reklama Sklik -->
                <div id="sklikReklama_60394"></div>
                <script>
                        var sklikData = { elm: "sklikReklama_60394", zoneId: "60394", w: 970, h: 310 };
                </script>
                <script src="//c.imedia.cz/js/script.js"></script>
            </footer>
            
    </body>
</html>



