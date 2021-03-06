angular.module('app').controller('novaTurmaCtrl',['$scope', '$state', 'apiService', 'apiConstantes', novaTurmaCtrl])

function novaTurmaCtrl($scope, $state, apiService, apiConstantes){
    
    if($state.params.turma){
        $scope.turma = $state.params.turma
        $scope.turma.diaAulaTurmaApoio = prepararTurmaDiaAula2($scope.turma.diaAulaTurmas)
        console.log($scope.turma)
    }else{
        $scope.turma = {};
        $scope.turma.diaAulaTurma = [];
        $scope.turma.diaAulaTurmaApoio = [];
    }

    $scope.unidades = [];
    $scope.cursos = [];
    $scope.alunos = [];

    /*$scope.fecharModal = function(){ 
        $("#modal").modal('hide');
        $('.modal-backdrop').remove()
    }*/

    $scope.compararDiaSemana = function(obj1, obj2) {
        return obj1 === obj2;
    }
    $scope.compararAluno = function(obj1, obj2) {
        return obj1.id === obj2.id;
    }

    $scope.checkboxDias = [
        {text: "SEG", value: diasSemanaEnum.SEG},
        {text: "TER", value: diasSemanaEnum.TER},
        {text: "QUA", value: diasSemanaEnum.QUA},
        {text: "QUI", value: diasSemanaEnum.QUI},
        {text: "SEX", value: diasSemanaEnum.SEX},
        {text: "SAB", value: diasSemanaEnum.SAB},
        {text: "DOM", value: diasSemanaEnum.DOM}
    ]

    function getListaAlunos(){
        apiService.get(apiConstantes.baseUrlAPI + apiConstantes.alunoDisponivel).then(function(result){
            $scope.alunos = result.data;
            if($scope.turma.id){
                apiService.get(apiConstantes.baseUrlAPI + apiConstantes.alunoPorTurma, $scope.turma.id).then(function(result){
                    result.data.forEach(aluno => $scope.alunos.push(aluno))
                }, function(error){

                }) 
            }
        }, function(error){
            console.log(error)
        })
    }

    function getUnidades(){
        apiService.get(apiConstantes.baseUrlAPI + apiConstantes.unidade).then(function(result){
            $scope.unidades = result.data;
        }, function(error){
            console.log(error)
        })
    }

    function getCursos(){
        apiService.get(apiConstantes.baseUrlAPI + apiConstantes.curso).then(function(result){
            $scope.cursos = result.data;
        }, function(error){
            console.log(error)
        })
    }
    getListaAlunos();
    getUnidades();
    getCursos();

    function prepararTurmaDiaAula(array){
        return array.map(value => ({diaSemana: value}))
    }

    function prepararTurmaDiaAula2(array){
        return array.map(item => item.diaSemana)
    }

    $scope.salvarTurma = function(turma){
        $scope.turma.diaAulaTurma = prepararTurmaDiaAula($scope.turma.diaAulaTurmaApoio)
        apiService.post(apiConstantes.baseUrlAPI + apiConstantes.turma, turma).then(function(result){
            $scope.turma = {}
            $("#modal-aluno-adicionado").modal('show');
        }, function(error){
            console.log(error)
        })
    }

    $scope.alterarTurma = function(turma){
        $scope.turma.diaAulaTurma = prepararTurmaDiaAula($scope.turma.diaAulaTurmaApoio)
        apiService.put(apiConstantes.baseUrlAPI + apiConstantes.turma, turma).then(function(result){
            $scope.turma = {}
            $("#modal-aluno-adicionado").modal('show');
        }, function(error){
            console.log(error)
        })
    }

    $scope.limparForm = function(){
        $scope.turma = {};
    }
}
