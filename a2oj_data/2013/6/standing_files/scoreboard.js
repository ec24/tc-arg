$(function() {

    var sortingFuncs = {
        number: function(i, j) {
        	if (i[0] == j[0])
        		return i[1] - j[1];
            return i[0] - j[0];
        },
        string: function(i, j) {
        	if (i[0].toLowerCase() == j[0].toLowerCase())
        		return i[1] - j[1];
            return (i[0].toLowerCase() > j[0].toLowerCase()) ? 1 : -1;
        },
        row: function(i, j) {
            if (i[2] != j[2])
            	return j[2] - i[2];
            if (i[3] != j[3])
            	return i[3] - j[3];
            return (i[1] > j[1]) ? 1 : (i[1] == j[1]) ? 0 : -1;
        }
    };

    var teams = null;
    
    var colSortedOn = 0;
    var ascending = true;
    var sortingFunc = sortingFuncs.number;
    
    //it is currently updating..
    var updating = false;
    
    var generateTable = function(){
        var table = $('#scoreboard .template').clone();
        table.attr('class', 'actualTable');
        var tBody = $(table[0].tBodies[0]);
        
        //sort the output..
        teams.sort(function(i, j){
        	if (sortingFunc != sortingFuncs.row) {
	            i = [i[colSortedOn], i[i.length - 1]];
	            j = [j[colSortedOn], j[j.length - 1]];
        	}
            return (ascending) ? sortingFunc(i,j) : 0-sortingFunc(i,j);
        });
        
        var cellsCnt = 0;

        $.each(teams, function(i, team) {
            var row = null;
            var str = '' + team[2];
            if (str.length > 1 && str[0] == '<' && str[1] == 'a') {
	            if (i % 2 == 0)
	            	row = $('<tr/>', {
	                    css: {
	                        height: '25px',
	                    	fontStyle: 'italic',
	                    	color: '#A4A4A4',
	                    }
	                });
	            else
	            	row = $('<tr/>', {
	                    css: {
	                        height: '25px',
	                    	backgroundColor: '#F0F0F6',
	                    	fontStyle: 'italic',
	                    	color: '#A4A4A4',
	                    }
	                });
            } else {
	            if (i % 2 == 0)
	            	row = $('<tr/>', {
	                    css: {
	                        height: '25px',
	                    }
	                });
	            else
	            	row = $('<tr/>', {
	                    css: {
	                        height: '25px',
	                    	backgroundColor: '#F0F0F6',
	                    }
	                });
            }
            var cnt = 0;
            $.each(team, function(j, value) {
            	if (j + 1 < team.length) {
	            	cnt += 1;
	            	if (j + problems.length + 1 < team.length) {
		                row.append($('<td />', {
		                    innerHTML: value,
		                    css: {
		                        textAlign: 'center',
		                    }
		                }));
	            	} else {
	            		if (value[1] == "")
	            			value[1] = "transparent";
		                row.append($('<td />', {
		                    innerHTML: value[0],
		                    css: {
		                        textAlign: 'center',
		                        backgroundColor: value[1],
		                    }
		                }));
	            	}
            	}
            });
            cellsCnt = cnt;
            tBody.append(row);
        });

        var row = $('<tr/>', {
            css: {
                height: '25px',
            	backgroundColor: '#E6EEEE',
            }
        });
        row.append($('<td />', {
        	text: 'Total Submitted',
        	colspan: cols,
            css: {
                textAlign: 'center',
            }
        }));
        $.each(problems, function(j, problem) {
            row.append($('<td />', {
            	text: sub[j],
                css: {
                    textAlign: 'center',
                }
            }));
        });
        tBody.append(row);

        row = $('<tr/>', {
            css: {
                height: '25px',
            	backgroundColor: '#E6EEEE',
            }
        });
        row.append($('<td />', {
        	text: 'First Accepted',
        	colspan: cols,
            css: {
                textAlign: 'center',
            }
        }));
        $.each(problems, function(j, problem) {
        	if (best[j] == -1)
        		best[j] = "--";
            row.append($('<td />', {
            	text: best[j],
                css: {
                    textAlign: 'center',
                }
            }));
        });
        tBody.append(row);

        row = $('<tr/>', {
            css: {
                height: '25px',
            	backgroundColor: '#E6EEEE',
            }
        });
        row.append($('<td />', {
        	text: 'Total Accepted',
        	colspan: cols,
            css: {
                textAlign: 'center',
            }
        }));
        $.each(problems, function(j, problem) {
            row.append($('<td />', {
            	text: ac[j],
                css: {
                    textAlign: 'center',
                }
            }));
        });
        tBody.append(row);
        
        row = $('<tr/>', {
            css: {
                height: '25px',
            	backgroundColor: '#E6EEEE',
            }
        });
        row.append($('<td />', {
        	colspan: cols,
        }));
        $.each(problems, function(j, problem) {
        	if (problem.Judge == 'HOJ')
        		row.append($('<td />', {
            		title: String.fromCharCode(65 + j) + ' - ' + problem.Title,
                    innerHTML: '<b>' + String.fromCharCode(65 + j) + '</b>',
                    css: {
                        textAlign: 'center',
                    }
                }));
        	else
	        	row.append($('<td />', {
	        		title: problem.Title,
	                innerHTML: '<a href=\'' + problem.URL + '\' class=\'normal\' target=\'_blank\'>P' + (j + 1) + '</a>',
	                css: {
	                    textAlign: 'center',
	                }
	            }));
        });
        tBody.append(row);

        row = $('<tr/>', {
            css: {
                height: '10px',
            	backgroundColor: '#FFFFFF',
            	border: '0px solid #FFFFFF',
            }
        });
        row.append($('<td />', {
        	colspan: cellsCnt,
            css: {
            	border: '0px solid #FFFFFF',
            }
        }));
        tBody.append(row);
        
        //attach click events..
        if (srt) {
	        table.find('.fe-sortable').each(function(i, header){
	            header = $(header);
	            header.click(function(event){
	                event.preventDefault();
	                if(updating){
	                    return;
	                }
	                updating = true;
	                if(colSortedOn == i){
	                    ascending = !ascending;
	                } else {
	                    ascending = true;
	                }
	                colSortedOn = i;
	                sortingFunc = (header.hasClass('fe-string')) ? sortingFuncs.string : sortingFuncs.number;
	                updateTable();
	            });
	        });
        }
		
        return table;
    };
    
    //Updates the status with the current time..
    var updateStatusTime = function(){
    	$.getJSON('get?type=serverTimePretty', function(data) {
    		$('#scoreboard .status').html("Updated at: " + data);
    		var txt = "";
    		if (blind)
    			txt = "(The blind part of the contest has started";
    		if (cells >= 400 && running) {
    			$('#scoreboard .triggerUpdates').selected=true;
    			if (blind)
    				txt += " - ";
    			else
    				txt += "(";
    			txt += "The live updates feature is disabled for this contest";
    		}
    		if(blind || (cells >= 400 && running))
    			txt += ")";
    		$('#scoreboard .blind').html(txt);
    	});
    };
    
    var table = null;
    var contest = null;
    var problems = null;
    var cols = null;
    var best = null;
    var ac = null;
    var sub = null;
    var blind = null;

    var url = 'get?type=contestRows&ID=' + ID;
    if (My)
    	url += "&My";
    if (non)
    	url += "&non";

    $.getJSON('get?type=contest&ID=' + ID, function(data1) {
		contest = data1;
		$.getJSON('get?type=contestProblems&ID=' + ID, function(data2) {
			problems = data2;

			$.getJSON(url, function(data) {
				teams = data.ScoreboardRows;
				cols = data.ColsCnt;
				cells = data.CellsCnt;
				sub = data.TotalSubmitted;
				ac = data.TotalAccepted;
				best = data.FirstAccepted;
				blind = data.IsBlind;
			    table = generateTable().show();
			    $(table[0].tHead.rows[0].cells[colSortedOn]).append((ascending) ? '&uarr;' : '&darr;');
			    $('#scoreboard .tableHolder').append(table);
			    updateStatusTime();
			});
		});
	});

    //Updates the table..
    var updateTable = function(updateStatus){
        var newTable = generateTable();
        table.rankingTableUpdate(newTable, {
            duration: [1000,200,700,200,1000],
            onComplete: function(){
                updating = false;
                if(updateStatus){
                   updateStatusTime();
                }
            },
            animationSettings: {
            	up: {
                    left: 0,
                    backgroundColor: '#CCFFCC'
                },
                down: {
                    left: 0,
                    backgroundColor: '#FFCCCC'
                },
                fresh: {
                    left: 0,
                    backgroundColor: '#CCFFCC'
                },
                drop: {
                    left: 0,
                    backgroundColor: '#FFCCCC'
                }
            }
        });
        table = newTable;
        $(table[0].tHead.rows[0].cells[colSortedOn]).append((ascending) ? '&uarr;' : '&darr;');
    };
    
    var loopFunc = function(){
    	if(cells >= 400) {
    		return;
    	}
    	if (updating) {
    		return;
    	}
		updating = true;
		$('#scoreboard .status').html("Updating..");
		$.getJSON(url, function(data) {
			teams = data.ScoreboardRows;
			cols = data.ColsCnt;
			cells = data.CellsCnt;
			sub = data.TotalSubmitted;
			ac = data.TotalAccepted;
			best = data.FirstAccepted;
			blind = data.IsBlind;
			updateTable(true);
		});
	};
    
    //reference to the infinite loop..
    var loop = null;
    if (running)
    	loop = setInterval(loopFunc, 30000);
    
	$('#scoreboard .triggerUpdates').click(function(event){
		if (srt) {
			if (updating) {
				event.preventDefault();
				return;
			}
			if(!loop){
				loopFunc();
				loop = setInterval(loopFunc, 30000);
			} else {
				clearInterval(loop);
				loop = null;
			}
			//event.preventDefault();
		}
	});
	
	
	
	
});
