extends AudioStreamPlayer

func _ready() -> void:
	# Automatically replay the music when it finishes
	finished.connect(_on_music_finished)

func _on_music_finished() -> void:
	play()
