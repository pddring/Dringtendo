var DT = {
	labelsData: {},
	labelsInstructions: {},

	data: [],
	stack: [],

	instructions: [],

	registers: {
		PC: 0,
		ACC: 0,
		IR: 0,
		INS: "0000",
		ISR: 0,
		SP: 0
	},

	init: function() {
		$('.btn_load_example').click(function(e) {
			var id = e.currentTarget.id.split("_")[3];
			var code = $('#ex' + id + ' pre').text()
			DT.editor.setValue(code);
			DT.assemble(code);
		});
		var html = '<div class="device"><h2>Screen:</h2><table>';
		var address = 0;
		for(var y = 0; y < 8; y++) {
			html += '<tr>';
			for(var x = 0; x < 8; x++) {
				html += '<td><img data-toggle="tooltip" title="Data memory location: ' + address + '" class="sprite" id="px_' + address + '"></td>';
				DT.data[address] = 0;
				address++;
			}
			html += '</tr>';
		}

		for(var i = 0; i < 256; i++) {
			DT.data[i] = 0;
			DT.instructions[i] = "0000";
			DT.stack[i] = 0;
		}
		html += '</table>'

		+ '<div class="buttons">'
		+ '<button data-toggle="tooltip" title="Mapped to data memory location 64" id="btn-up_64" class="cmd-btn btn btn-primary"><i class="fa fa-arrow-circle-up"></i></button> '
		+ '<button data-toggle="tooltip" title="Mapped to data memory location 65" id="btn-down_65" class="cmd-btn btn btn-primary"><i class="fa fa-arrow-circle-down"></i></button> '
		+ '<button data-toggle="tooltip" title="Mapped to data memory location 66" id="btn-left_66" class="cmd-btn btn btn-primary"><i class="fa fa-arrow-circle-left"></i></button> '
		+ '<button data-toggle="tooltip" title="Mapped to data memory location 67" id="btn-right_67" class="cmd-btn btn btn-primary"><i class="fa fa-arrow-circle-right"></i></button> '
		+ '<button data-toggle="tooltip" title="Mapped to data memory location 68" id="btn-action_68" class="cmd-btn btn btn-primary"><i class="fa fa-rocket"></i></button>'
		+ '</div></div>'

		+ '<div class="device"><h2>Code:</h2><pre id="code" rows="10" cols="80">'
		+ 'INP\nOUT\nHLT'
		+ '</pre>'
		+ '<div><button id="btn-assemble" class="btn btn-primary" data-toggle="tooltip" title="Translate code into instructions and load into instruction memory">Assemble</button> '
		+ '<button class="btn btn-primary" id="btn-reset" data-toggle="tooltip" title="Reset all memory and register values"><i class="fa fa-refresh"></i> Reset</button> '
		+ '<button class="btn btn-primary" id="btn-step" data-toggle="tooltip" title="Run a single instruction"><i class="fa fa-step-forward"></i> Step</button> '
		+ '<button class="btn btn-primary" id="btn-play1hz" data-toggle="tooltip" title="Run one instruction per second"><i class="fa fa-play"></i> Play (1 Hz)</button> '
		+ '<button class="btn btn-primary" id="btn-playfast" data-toggle="tooltip" title="Run instructions quickly, updating displayed memory and register values as they run"><i class="fa fa-play"></i> Fast</button> '
		+ '<button class="btn btn-primary" id="btn-playturbo" data-toggle="tooltip" title="Run instructions quickly without updating displayed memory and register values"><i class="fa fa-fast-forward"></i> Turbo</button> '
		+ '<button class="btn btn-primary" id="btn-stop" data-toggle="tooltip" title="Pause execution of instructions"><i class="fa fa-stop"></i> Stop</button> '
		+ '</div></div>'

		+ '<div class="device"><h2>Data Memory:</h2><div class="memory">'
		+ '<table class="table table-dark"><thead><tr><th>Address</th><th>Label</th><th>Value</th></tr></thead><tbody>';

		for(var i = 0; i < DT.data.length; i++) {
			var label = DT.labelsData[i];
			if(!label) {
				label = "";
			}
			html += '<tr><td>' + i + '</td><td id="dml_' + i + '" class="label">' + label + '</td><td id="dm_' + i + '" class="dm_val">' + DT.data[i] + '</td></tr>';
		}

		html += '</tbody></table></div></div>'

		+ '<div class="device"><h2>Instruction Memory:</h2><div class="memory">'
		+ '<table class="table table-dark"><thead><tr><th>Address</th><th>Label</th><th>Value</th><th>Mnemonic</th></tr>'
		+ '</thead><tbody>';

		for(var i = 0; i < DT.instructions.length; i++) {
			var label = DT.labelsInstructions[i];
			if(!label) {
				label = "";
			}
			html += '<tr class="im-row" id="imr_' + i + '"><td>' + i + '</td><td id="iml_' + i +'" class="label">' + label + '</td><td id="im_' + i + '" class="im_val">' + DT.instructions[i] + '</td><td id="imm_' + i + '" class="im_mne"></td></tr>';
		}

		html += '</tbody></table></div></div>';

		html += '<div class="device"><h2>Stack:</h2><div class="memory">'
		+ '<table id="stack" class="table table-dark"><thead><tr><th>Position</th><th>Value</th></tr></thead>';
		html += DT.updateStack(true);
		html += '</table>'
		+ '</div></div>';

		html += '<div class="device"><h2>Registers</h2>'
		+ '<div class="register" data-toggle="tooltip" title="Program Counter"><span class="reg-name">PC</span>:<span class="reg-value" data-reg-name="PC">0</span></div>'
		+ '<div class="register" data-toggle="tooltip" title="Accumulator"><span class="reg-name">ACC</span>:<span class="reg-value" data-reg-name="ACC">0</span></div>'
		+ '<div class="register" data-toggle="tooltip" title="Index Register"><span class="reg-name">IR</span>:<span class="reg-value" data-reg-name="IR">0</span></div>'
		+ '<div class="register" data-toggle="tooltip" title="Instruction Register"><span class="reg-name">INS</span>:<span class="reg-value" data-reg-name="INS">0</span></div>'
		+ '<div class="register" data-toggle="tooltip" title="Interrupt Service Routine"><span class="reg-name">ISR</span>:<span class="reg-value" data-reg-name="ISR">0</span></div>'
		+ '<div class="register" data-toggle="tooltip" title="Stack Pointer"><span class="reg-name">SP</span>:<span class="reg-value" data-reg-name="SP">0</span></div>'
		+ '</div>';
		
		html += '<div class="device"><h2>Tips:</h2><pre>'
		+ 'LDA 0 // load from data address 0 into ACC(direct address mode) \n' 
		+ 'LDA #1 // load 1 into acc (immediate address mode)\n'
		+ 'LDA &2 // load from data address 2 int ACC(direct address mode)\n'
		+ 'LDA ~3 // load from address stored in address 3 into ACC(indirect address mode)\n'
		+ 'STB #64 // store immediate value 64 into base address register\n'
		+ 'LDA [4] // load from address IR+4 into ACC(indexed mode with literal offset)\n'
		+ 'LDA [Label] // load from address IR+offset stored in Label into ACC(indexed mode with direct offset)\n'
		+ 'ORG 70 // set address of next data value to be 70\n'
		+ 'Label: DAT 55 // store the value 55 into next data location (70)\n'
		+ 'DAT 56 // store the value 56 into next data location (71)\n'
		+ '</pre></div>';
		
		html += '<div class="device"><h2>Sprites:</h2><div class="memory"><table><tr><th>Value</th><th>Sprite</th></tr>';
		for(var i = 0; i <= 99; i++) {
			var url = '' + i;
			while(url.length < 2) {
				url = "0" + url;
			}
			html += '<tr><td>' + i + '</td><td><img class="sprite" src="sprites/' + url + '.png"></td></tr>';
		}

		
		html += '</table></div></div>';



		$('#game').html(html);
		$('[data-toggle="tooltip"]').tooltip();
		DT.editor = ace.edit('code');
		var session = DT.editor.getSession();
		session.setMode("ace/mode/lmc");
		$('.dm_val,.sprite').click(function(e) {
			var id = e.currentTarget.id;
			var address = id.split("_")[1];
			var val = prompt("Enter a value:");
			DT.setDataMemory(address, val);
		});
		$('#btn-assemble').click(function() {
			DT.stop();
			DT.reset();
			var code = DT.editor.getValue();
			DT.assemble(code);
		});
		$('.im_val').click(function(e) {
			var id = e.currentTarget.id;
			var address = id.split("_")[1];
			var val = prompt("Enter an instruction in hex");
			DT.setInstructionMemory(address, val);
		});
		$('.im_mne').click(function(e) {
			var id = e.currentTarget.id;
			var address = id.split("_")[1];
			var val = prompt("Enter an instruction mnemonic").toUpperCase();
			var i = DT.assembleSingleInstruction(val);
			if(i.valid) {
				DT.setInstructionMemory(address, i.assembled, val);	
			} else {
				alert("Invalid instruction");
			}
			
		});
		$('#btn-reset').click(DT.reset);
		$('#btn-step').click(DT.step);
		$('#btn-play1hz').click(function() {
			DT.delay = 1000;
			DT.stepsPerRefresh = 1;
			DT.play();
		});
		$('#btn-playfast').click(function() {
			DT.delay = 1;
			DT.stepsPerRefresh = 1;
			DT.play();
		});
		$('#btn-playturbo').click(function() {
			DT.delay = 1;
			DT.stepsPerRefresh = 500;
			DT.play();
		});

		$('#btn-stop').click(DT.stop);
		$('.cmd-btn').click(function(e) {
			var id = e.currentTarget.id;
			var address = DT.validInt(id.split("_")[1], 0, 255);
			var val = DT.data[address];
			if(val < 255) {
				DT.setDataMemory(address, val + 1);
			}
			// trigger interrupt
			if(DT.registers.ISR > 0) {
				if(DT.registers.SP < DT.stack.length) {
					DT.stack[DT.registers.SP] = DT.registers.PC;
					DT.registers.PC = DT.registers.ISR;
					DT.registers.SP++;
					DT.updateStack();
					DT.updateRegisters();
				} else {
					DT.error("Stack overflow");
				}
			}
		});

		DT.reset();
	},
	
	isTurbo: function() {
		return DT.stepsPerRefresh > 1;
	},

	validInt:function (val, min, max) {
		if(val === undefined) {
			val = 0;
		}
		val = parseInt(val);
		if(val < min) val = min;
		if(val > max) val = max;
		return val;
	},

	setInstructionMemory: function(address, value, mnemonic) {
		address = this.validInt(address, 0, 255);
		if(mnemonic === undefined) {
			mnemonic = DT.disassemble(value).instruction;
		}
		mnemonic = mnemonic.replace(/\/\/.*$/, '');
		DT.instructions[address] = value;
		if(!DT.isTurbo()) {
			$('#imm_' + address).text(mnemonic);
			$('#im_' + address).text(value);
		}
	},

	error: function(message) {
		alert("Error: " + message);
	},

	updateStack: function(ret) {
		var html = '';
		for(var i = 0; i < DT.stack.length; i++) {
			html += '<tr ';
			if(DT.registers.SP == i+1) {
				html += 'class="next-instruction" '
				}
			html += 'id="stackr_' + i + '"><td>' + i + '</td><td id="stackv_' + i + '">' + DT.stack[i] + '</td></tr>';
		}
		if(ret) {
			return html;
		}
		if(!DT.isTurbo()) {
			$('#stack').html(html);
		}
	},

	setDataMemory: function(address, value) {
		address = this.validInt(address, 0, 255);
		value = this.validInt(value, -128, 127);
		if(address < 64) {
			DT.setSprite(address, value);
		} else {
			if(!DT.isTurbo()) {
				$('#dm_' + address).text(value);
			}
			DT.data[address] = value;	
		}
	},

	setSprite: function(address, sprite) {
		address = this.validInt(address, 0, 63);
		sprite = this.validInt(sprite, 0, 255)
		if(!DT.isTurbo()) {
			$('#dm_' + address).text(sprite);
		}
		var url = 'sprites/' + (sprite.toString().padStart(2,"0")) + ".png";
		this.data[address] = sprite;
		document.getElementById('px_' + address).src = url;
	},

	getSprite: function(address) {
		address = this.validInt(address, 0, 63);
		return this.data[address];

	},

	updateScreen: function() {
		for(var i = 0; i < 64; i++) {
			DT.setSprite(i, DT.data[i]);
		}
	},

	updateRegisters: function() {
		if(!DT.isTurbo()) {
			$('.reg-value[data-reg-name="ACC"]').text(DT.registers.ACC);
			$('.reg-value[data-reg-name="PC"]').text(DT.registers.PC);
			$('.reg-value[data-reg-name="INS"]').text(DT.registers.INS);
			$('.reg-value[data-reg-name="IR"]').text(DT.registers.IR);
			$('.reg-value[data-reg-name="ISR"]').text(DT.registers.ISR);
			$('.reg-value[data-reg-name="SP"]').text(DT.registers.SP);
			$('.im-row').removeClass('next-instruction');
			$('#imr_' + DT.registers.PC).addClass('next-instruction');
		}
	},

	stop: function() {
		clearTimeout(DT.tm);
		window.cancelAnimationFrame(DT.tm);
		if(DT.isTurbo()) {
			DT.stepsPerRefresh = 1;
			DT.updateRegisters();
			for(var i = 0; i < 255; i++) {
				DT.setDataMemory(i, DT.data[i]);
				DT.setInstructionMemory(i, DT.instructions[i]);
			}
			DT.updateStack(false);
			
		}
		DT.delay = 0;
	},

	delay: 500,

	play: function() {
		clearTimeout(DT.tm);
		if(DT.stepsPerRefresh === undefined) {
			DT.stepsPerRefresh = 1;
		}
		for(var i = 0; i < DT.stepsPerRefresh; i++) {
			DT.step();	
		}
		if(DT.delay == 1) {
			DT.tm = window.requestAnimationFrame(DT.play);
		} else {
			if(DT.delay > 0) {
				DT.tm = setTimeout(DT.play, DT.delay);		
			}
		}
	},

	step: function() {
		// fetch
		DT.registers.INS = DT.instructions[DT.registers.PC];
		DT.registers.PC++;

		// decode
		var i = DT.disassemble(DT.registers.INS);
		//console.log(i);

		var val = i.operand;
		var address = 0;
		switch(i.addressMode) {
			case 'direct':
				address = i.operand;
				val = DT.data[address];
			break;
			case 'immediate':
				val = i.operand;
			break;
			case 'indirect':
				address  = DT.data[i.operand];
				val = DT.data[address];
			break;
			case 'indexed':
				if(i.hex[0] == "3") {
					address = DT.registers.IR + i.operand;
					val = DT.data[address];	
				}
				if(i.hex[0] == "4") {
					address = DT.registers.IR + DT.data[i.operand];
					val = DT.data[address];
				}
			break;
		}
		
		
		// execute
		switch(i.opcode) {
			case 'HLT':
				DT.registers.PC--;
			break;

			case 'ADD':
				DT.registers.ACC += val;
			break;

			case 'SUB':
				DT.registers.ACC -= val;
			break;

			case 'STA':
				DT.setDataMemory(address, DT.registers.ACC);
			break;

			case 'LDIR':
				DT.registers.IR = val;
			break;

			case 'LDISR':
				DT.registers.ISR = i.operand;
			break;

			case 'LDA':
				DT.registers.ACC = val;
			break;

			case 'BRA':
				DT.registers.PC = i.operand;
			break;

			case 'BRZ':
				if(DT.registers.ACC == 0) {
					DT.registers.PC = i.operand;
				}
			break;

			case 'BRP':
				if(DT.registers.ACC >= 0) {
					DT.registers.PC = i.operand;
				}
			break;

			case 'PUSH':
				if(DT.registers.SP < DT.stack.length) {
					DT.stack[DT.registers.SP] = DT.registers.ACC;
					DT.registers.SP++;
					DT.updateStack();
				} else {
					DT.error("Stack overflow");
				}
			break;

			case 'POP':
				if(DT.registers.SP > 0) {
					DT.registers.SP--;
					DT.registers.ACC = DT.stack[DT.registers.SP];
					DT.updateStack();	
				} else {
					DT.error("Stack underflow");
				}
				
			break;

			case 'CALL':
				if(DT.registers.SP < DT.stack.length) {
					DT.stack[DT.registers.SP] = DT.registers.PC;
					DT.registers.PC = i.operand;
					DT.registers.SP++;
					DT.updateStack();
				} else {
					DT.error("Stack overflow");
				}
			break;

			case 'RET':
			if(DT.registers.SP > 0) {
				DT.registers.SP--;
				DT.registers.PC = DT.stack[DT.registers.SP];
				DT.updateStack();
			} else {
				DT.error("Stack underflow");
			}
				
			break;

			case 'INP':
				DT.registers.ACC = DT.validInt(prompt("Enter input value:"), -127, 255);
			break;

			case 'OUT':
				alert("Output: " + DT.registers.ACC);
			break;
			
			case 'RND':
				DT.registers.ACC = Math.floor(Math.random() * (i.operand + 1));
				break;
		}

		DT.updateRegisters();
	},

	reset: function() {
		// clear registers
		DT.registers = {
			PC: 0,
			ACC: 0,
			IR: 0,
			INS: "0000",
			ISR: 0,
			SP: 0
		};
		DT.updateRegisters();

		// clear labels
		DT.labelsData = {};
		DT.labelsInstructions = {};
		$('.label').text('');

		DT.stack = [];
		// clear memory
		for(var i = 0; i < 256; i++) {
			DT.setDataMemory(i, 0);
			DT.setInstructionMemory(i, "0000");
			DT.stack[i] = 0;
		}
	},

	convert: {
		toHex: function(i, nibbles) {
			var hex = parseInt(i).toString(16);
			while(hex.length < nibbles) {
				hex = "0" + hex;
			}
			return hex;
		},

		toDenary: function(hex) {
			return parseInt(hex, 16);
		}
	},

	disassemble: function(hex) {
		while(hex.length < 4) {
			hex = "0" + hex;
		}
		var i = {
			hex: hex
		};

		// establish addressing mode
		switch(hex[0]) {
			case '0':
				i.addressMode = "direct";
				i.addressModeOperator = "";
			break;
			case '1':
				i.addressMode = "immediate";
				i.addressModeOperator = "#";
			break;
			case '2':
				i.addressMode = "indirect";
				i.addressModeOperator = "~";
			break;
			case '3':
				i.addressMode = "indexed";
				i.addressModeOperator = "[";
			break;
			case '4':
				i.addressMode = "indexed";
				i.addressModeOperator = "[";
			break;
		}

		// establish opcode
		switch(hex[1]) {
			case '0':
				i.opcode = 'HLT';
			break;
			case '1':
				i.opcode = 'ADD';
			break;
			case '2':
				i.opcode = 'SUB';
			break;
			case '3':
				i.opcode = 'STA';
			break;
			case '4':
				i.opcode = 'LDIR';
			break;
			case '5':
				i.opcode = 'LDA';
			break;
			case '6':
				i.opcode = 'BRA';
			break;
			case '7':
				i.opcode = 'BRZ';
			break;
			case '8':
				i.opcode = 'BRP';
			break;
			case '9':
				if(hex[3] == "1") {
					i.opcode = 'INP';	
				} else {
					i.opcode = "OUT";
				}
			break;
			case 'A':
				i.opcode = 'LDISR';
			break;
			case 'B':
				i.opcode = "PUSH";
				break;
			case 'C':
				i.opcode = "POP";
				break;
			case 'D':
				i.opcode = "CALL";
			break;
			case 'E':
				i.opcode = "RET";
				break;
			case 'F':
				i.opcode = "RND";
				break;
			break;
		}

		i.operand = DT.convert.toDenary(hex[2] + hex[3]);
		switch(i.opcode) {
			// instructions with addresses
			case 'ADD':
			case 'SUB':
			case 'STA':
			case 'LDIR':
			case 'LDA':
			case 'LDISR':
			case 'BRA':
			case 'BRZ':
			case 'BRP':
			case 'CALL':
			case 'RND':
				i.instruction = i.opcode + " " + i.addressModeOperator + i.operand;	
			break;

			// no address instructions
			case 'INP':
			case 'OUT':
			case 'HLT':
			case 'PUSH':
			case 'POP':
			case 'RET':
				i.instruction = i.opcode;
			break;

			default: 
				i.instruction = "INVALID";
		}

		if(i.addressModeOperator == "[") {
			i.instruction += "]"
		}
		return i;
	},

	assembleSingleInstruction: function(instruction) {
		var m = instruction.match(/([A-Z]{3,5})(\s+([#&~[])?((0x[0-9A-F]{1,2})|(\d+)|([A-Za-z]+)))?/);
		var i = {
			valid: false
		};
		if(m) {
			// extract data from regex
			i = {
				valid: true,
				opcode: m[1],
				denary: m[6],
				addressModeOperator: m[3],
				label: m[7],
				hex: m[5],
				assembled: ""
			};

			// deal with address mode
			switch(i.addressModeOperator) {
				case '~':
					i.addressMode = "indirect";
					i.assembled = "2";
				break;
				case '[':
					i.addressMode = "indexed";
					if(i.label) {
						i.assembled = "4"; // direct indexed
					} else {
						i.assembled = "3"; // immediate indexed 
					}
					break;
				case '#':
					i.addressMode = "immediate";
					i.assembled = "1";
				break;
				case '&':
				default:
					i.addressMode = "direct";
					i.assembled = 0;
			}
			i.labelSource = "ignore";

			// lookup opcode
			switch(i.opcode) {
				case 'ADD':
					i.assembled += '1';
					i.labelSource = "data"; 
				break;
				case 'SUB':
					i.assembled += '2';
					i.labelSource = "data"; 
				break;
				case 'STA':
					i.assembled += '3';
					i.labelSource = "data"; 
				break;
				case 'LDIR':
					i.assembled += '4';
					i.labelSource = "data"; 
				break;
				case 'LDA':
					i.assembled += '5';
					i.labelSource = "data"; 
				break;
				case 'BRA':
					i.assembled += '6';
					i.labelSource = "instruction"; 
				break;
				case 'BRZ':
					i.assembled += '7';
					i.labelSource = "instruction"; 
				break;
				case 'BRP':
					i.assembled += '8';
					i.labelSource = "instruction"; 
				break;
				case 'INP':
					i.assembled += '9';
					i.denary = 1;
				break;
				case 'OUT':
					i.assembled += '9';
					i.denary = 2;
				break;
				case 'LDISR':
					i.assembled += 'A';
					i.labelSource = "instruction"; 
				break;
				case 'PUSH':
					i.assembled += 'B';
				break;
				case 'POP':
					i.assembled += 'C';
				break;
				case 'CALL':
					i.assembled += 'D';
					i.labelSource = "instruction";
				break;
				case 'RET':
					i.assembled += 'E';
				break;
				case 'RND':
					i.assembled += 'F';
					i.labelSource = "data";
				break;
				case 'HLT':
					i.assembled += '0';
				break;
				default:
					i.valid = false;
					i.assembled = '0000';
					i.error = "Invalid op code";
					debugger;
			}

			// lookup label
			if(i.label) {
				switch(i.labelSource) {
					case 'data':
						if(DT.labelsData[i.label] !== undefined) {
							i.denary = DT.labelsData[i.label];
						} else {
							i.error = "Label " + i.label + " not defined";
							i.denary = 0;
							i.valid = false;
						}
					break;
					case 'instruction':
						if(DT.labelsInstructions[i.label] !== undefined) {
							i.denary = DT.labelsInstructions[i.label];
						} else {
							i.error = "Label " + i.label + " not defined";
							i.denary = 0;
							i.valid = false;
						}
					break;
				}
			}
			// convert denary to binary and vice versa if necessary
			if(i.hex === undefined && i.denary !== undefined) {
				i.hex = DT.convert.toHex(i.denary, 2);	
			}
			if(i.denary === undefined) {
				if(i.hex !== undefined) {
					i.denary = DT.convert.toDenary(i.hex);
				} else {
					i.denary = 0;
					i.hex = "00";
				}
				
			}

			i.assembled += i.hex;
			
		}
		return i;
	},

	assemble: function(code) {
		DT.reset();
		var lines = code.toUpperCase().split("\n");
		var instructions = [];
		var compiled = [];
		var address = 0;
		var data = [];

		for(var n = 0; n< lines.length; n++) {
			var line = lines[n];

			// strip comments and whitespace
			line = line.replace(/\/\/.*$/, "").trim();

			instructions[n] = {
				code: line,
				instruction: line,
				line: n+1
			};

			// check for labels:
			var m = line.match(/^([A-Z][A-Z0-9_]*:?)[ \t]*(LDIR|LDISR|PUSH|POP|CALL|RET|RND|ORG|LDA|STA|ADD|SUB|INP|OUT|HLT|BRZ|BRP|BRA|DAT)\b/);
			if(m) {
				instructions[n].label = m[1].replace(":", "");
				line = instructions[n].instruction = line.replace(m[1], "").trim();
			}

			// separate out data from instructions
			m = line.match(/\b(DAT)|(ORG)\b/);
			if(m) {
				data.push(instructions[n]);
			} else {
				// ignore empty lines
				if(line.length > 0) {
					instructions[n].address = address;
						
					// store instruction label	
					if(instructions[n].label) {
						DT.labelsInstructions[instructions[n].label] = address;
						DT.labelsInstructions[address] = instructions[n].label;
						$('#iml_' + address).text(instructions[n].label);
					}

					compiled[address++] = instructions[n];
				}	
			}
		}

		// process data
		var address = 0;
		for(var i = 0; i < data.length; i++) {
			var m = data[i].instruction.match(/(DAT|ORG)(\s+(\d+))?/);
			if(m) {
				switch(m[1]) {
					case 'ORG':
						address = DT.validInt(m[3], 0, 255);
					break;
					case 'DAT':
						data[i].address = address++;
						data[i].value = DT.validInt(m[3], 0, 255);
						DT.setDataMemory(data[i].address, data[i].value);
					break;
				}
				if(data[i].label) {
					DT.labelsData[data[i].label] = data[i].address;
					DT.labelsData[data[i].address] = data[i].label;
					$('#dml_' + data[i].address).text(data[i].label);
				}
			}
		}

		// process instructions
		for(var i = 0; i < compiled.length; i++) {
			compiled[i].compiled = DT.assembleSingleInstruction(compiled[i].instruction);
			if(compiled[i].compiled.valid) {
				DT.setInstructionMemory(i, compiled[i].compiled.assembled, compiled[i].instruction);	
			} else {
				alert("Error on line " + compiled[i].line + ": " + compiled[i].compiled.error);
			}
			
		}
		console.log(compiled, data);
	}
};
