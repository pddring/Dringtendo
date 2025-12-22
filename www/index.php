<?php
$examples = ["eg1.txt"];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Dringtendo64</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <link rel="stylesheet" href="styles.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <script src="https://use.fontawesome.com/d962a7b4e6.js"></script>
  <script src="lib.js"></script>
  <script src="ace/ace.js"></script>
  <script src="ace/mode-lmc.js"></script>

  
</head>
<body>
  <div class="container">
    <div class="device">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="about-tab" data-toggle="tab" href="#about" role="tab" aria-controls="about" aria-selected="true">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="instructions-tab" data-toggle="tab" href="#instructions" role="tab" aria-controls="instructions" aria-selected="false">Instruction Set</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="addressing-tab" data-toggle="tab" href="#addressing" role="tab" aria-controls="addressing" aria-selected="false">Addressing modes</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="extra-tab" data-toggle="tab" href="#extra" role="tab" aria-controls="contact" aria-selected="false">Additional instructions</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="examples-tab" data-toggle="tab" href="#examples" role="tab" aria-controls="contact" aria-selected="false">Examples</a>
        </li>
      </ul>
      <div class="tab-content" id="hints">
        <div class="tab-pane show active" id="about" role="tabpanel" aria-labelledby="about-tab">
          <h2>Dringtendo64</h2>
            <p>Dringtendo is a simple games console based on a Harvard CPU architecture. The CPU has a similar instruction set to a Little Man Computer (LMC) which has been extended to support immediate, indirect and indexed addressing modes as well as direct.</p>
            <p>There are 256 bytes of data memory, some of which are mapped to hardware devices such as 64 sprite tiles and 5 buttons.</p>
            <p>It's designed for A Level Computer Science students who want to get past the limitations of LMC and explore different addressing modes, interrupts and an alternative to a Von Neumann CPU.</p>
        </div>
        <div class="tab-pane" id="instructions" role="tabpanel" aria-labelledby="instructions-tab">
          <div class="memory">
            <h2>LMC Instruction Set</h2>
            <p>All Little Man Computer instructions should work on the Dringtendo:</p>
            <table class="table table-dark">
              <thead>
                <tr><th>Instruction</th><th>Example</th><th>Explanation</th></tr>
              </thead>
              <tr><td>ADD data</td><td>ADD 1</td><td>Add value at data memory address 1 to ACC</td></tr>
              <tr><td>SUB data</td><td>SUB 2</td><td>Subtract value at data memory address 2 from ACC</td></tr>
              <tr><td>STA data</td><td>STA 3</td><td>Save ACC to data memory address 3</td></tr>
              <tr><td>LDA data</td><td>LDA 4</td><td>Load value at data memory address 4 into ACC</td></tr>
              <tr><td>BRA instruction</td><td>BRA 5</td><td>Branch to instruction memory address 5 (always)</td></tr>
              <tr><td>BRZ instruction</td><td>BRZ 6</td><td>Branch to instruction memory address 6 (if ACC is zero)</td></tr>
              <tr><td>BRP instruction</td><td>BRP 7</td><td>Branch to instruction memory address 7 (if ACC is positive)</td></tr>
              <tr><td>INP</td><td>INP</td><td>Input to ACC</td></tr>
              <tr><td>OUT</td><td>OUT</td><td>Output ACC value</td></tr>
              <tr><td>HLT</td><td>HLT</td><td>Stop program</td></tr>
            </table>
          </div>
        </div>
        <div class="tab-pane" id="addressing" role="tabpanel" aria-labelledby="addressing-tab">
          <div class="memory">
          <h2>Addressing modes</h2>
          <p>There four addressing modes supported:</p>
          <table class="table table-dark">
            <thead>
              <tr><th>Addressing mode</th><th>Example</th><th>Explanation</th></tr>
            </thead>
            <tr><td>Immediate</td><td>LDA #100</td><td>Load 100 into ACC</td></tr>
            <tr><td>Direct</td><td>LDA @100</td><td>Load value from data memory address 100 into ACC</td></tr>
            <tr><td>Indirect</td><td>LDA ~100</td><td>Use address in data memory address 100 to load value into ACC</td></tr>
            <tr><td>Indexed (immediate offset)</td><td>LDA [100]</td><td>Load value from data memory address IR+100 into ACC</td></tr>
            <tr><td>Indexed (direct offset)</td><td>LDA [Label]</td><td>Load offset from labelled data memory location and set ACC to data value at IR+offset</td></tr>
          </table>
        </div>
        </div>
        <div class="tab-pane" id="extra" role="tabpanel" aria-labelledby="extra-tab">
          <h2>Additional instructions</h2>
          <p>As well as the Little Man Computer instruction set, there are some additional instructions:</p>
          <table class="table table-dark">
            <thead>
              <tr><th>Instruction</th><th>Example</th><th>Explanation</th></tr>
            </thead>
            <tr><td>LDIR data</td><td>LDIR #69</td><td>Load immediate value 69 into Index Register</td></tr>
            <tr><td>LDISR instruction</td><td>LDISR #0</td><td>Set interrupt service routine address to 0 (disable interrupts)</td></tr>
            <tr><td>LDISR instruction</td><td>LDISR #40</td><td>Set interrupt service routine address to 40 (interrupt calls instruction at address 40)</td></tr>
            <tr><td>PUSH</td><td>PUSH</td><td>Push value in ACC on to the stack</td></tr>
            <tr><td>POP</td><td>POP</td><td>Pop value from stack into ACC</td></tr>
            <tr><td>CALL instruction</td><td>CALL 23</td><td>Push PC on to stack then set PC to instruction</td></tr>
            <tr><td>RET</td><td>RET</td><td>Return from sub routine (pop address from stack into PC)</td></tr>
            <tr><td>RND</td><td>RND #5</td><td>Place a random number between 0  and 5 (inclusive) into the accumulator register</td></tr>
          </table>
          The following mnemonics are not instructions as they relate to how data is stored in data memory:
          <table class="table table-dark">
          <thead><tr><th>Mnemonic</th><th>Example</th><th>Explanation</th></tr></thead>
          <tr><td>ORG</td><td>ORG 69</td><td>Set the next data memory address to 69 (after all sprite and button memory locations)</td></tr>
          <tr><td>DAT</td><td><p>DAT 3</p><p>DAT 2</p></td><td>Stores the literal value 3 at the next available data location (69) then the value 2 into location 70</td></tr>
          </table>
        </div>
        <div class="tab-pane memory" id="examples" role="tabpanel" aria-labelledby="examples-tab">
          <h2>Examples:</h2>
          <div class="accordion" id="accordionExamples">
          	
           
           
           <?php
											$examples = scandir('examples');
											$i = 0;
											foreach($examples as $example) {
												if(preg_match("/\.txt/", $example)) {
													
													$i+=1;
													$contents = file_get_contents('examples/' . $example);
													$lines = explode("\n", $contents);
													$title = "";
													if(preg_match("/\/\/\s*(.*)/", $lines[0], $matches)) {
														$title = $matches[1];
													}
														echo('
													<div class="card">
														<div class="card-header" id="exh' . $i . '">
															<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#ex' . $i . '" aria-expanded="' . ($i==1?'true':'false') . '" aria-controls="ex' . $i . '">
																<h3>
													' . $example. '
																</h3> ' .  $title . '
															</button>
															<div class="example-buttons">
																<button class="btn btn-secondary btn_load_example" id="btn_load_example_' . $i . '"><i class="fa fa-edit"></i> Load</button>
																<a href="examples/' . $example . '" target="_blank" class="btn btn-secondary" class="btn_save" id="btn_save_example_' . $i . '">
																	<i class="fa fa-download"></i> Save
																</a>
															</div>
														</div>
													</div>');
												
												echo('
													<div id="ex' . $i . '" class="collapse' . ($i==1?' show':'') . '" aria-labelledby="exh' . $i . '" data-parent="#accordionExamples">
														<div class="card-body">
															<pre class="code-example">' . $contents . '
															</pre>
														</div>
													</div>
												');
												}
											}
											
											?>
        		</div>   
         </div>
         </div>
    </div>


  <div id="game"></div>

  
  </div>



<script>
	$(DT.init);
</script>

</body>
</html>
