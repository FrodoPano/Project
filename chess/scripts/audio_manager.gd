class_name AudioManager extends Node

@export var music_volume_db: float = -10.0
@export var music_bus: String = "Master"

var music_player: AudioStreamPlayer

func _ready() -> void:
	music_player = AudioStreamPlayer.new()
	add_child(music_player)
	music_player.bus = music_bus
	music_player.volume_db = music_volume_db
	# Make it loop
	music_player.finished.connect(_on_music_finished)

func play_music(stream: AudioStream) -> void:
	if music_player.playing:
		music_player.stop()
	
	music_player.stream = stream
	music_player.play()

func stop_music() -> void:
	music_player.stop()

func set_music_volume(volume_db: float) -> void:
	music_volume_db = volume_db
	music_player.volume_db = volume_db

func _on_music_finished() -> void:
	# Automatically replay for continuous music
	music_player.play()
